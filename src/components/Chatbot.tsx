import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare } from 'lucide-react';
import axios from 'axios';

// Define the AttendanceData interface
interface AttendanceData {
  daily_attendance: Record<string, string[]>;
  subject_attendance: Record<string, string>;
  timetable: Record<string, string[]>;
}

interface ChatbotProps {
  attendanceData: AttendanceData | null;
  username: string;
}

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC<ChatbotProps> = ({ attendanceData, username }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: `Hello ${username || 'there'}! I'm your AURA assistant. Ask me questions about your timetable, attendance, or anything else about your academic information.`, 
      sender: 'bot', 
      timestamp: new Date() 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const API_KEY = 'AIzaSyDu6pt9j6ZS9aM-ehWp9xVYXe_NMHkVXK4';

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // First check if we can handle it locally
      const localResponse = generateLocalResponse(inputValue.trim().toLowerCase());
      
      if (localResponse) {
        // If we have a local response, use it
        setTimeout(() => {
          setMessages(prevMessages => [...prevMessages, {
            text: localResponse,
            sender: 'bot',
            timestamp: new Date()
          }]);
          setIsTyping(false);
        }, 500);
      } else {
        // Otherwise, use Gemini API
        const geminiResponse = await generateGeminiResponse(inputValue, attendanceData);
        setMessages(prevMessages => [...prevMessages, {
          text: geminiResponse,
          sender: 'bot',
          timestamp: new Date()
        }]);
        setIsTyping(false);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prevMessages => [...prevMessages, {
        text: "Sorry, I encountered an error processing your request.",
        sender: 'bot',
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }
  };

  const generateGeminiResponse = async (query: string, attendanceData: AttendanceData | null) => {
    try {
      // Create context for the AI with attendance data
      let contextPrompt = `You are AURA, an Academic Utility and Resource Allocator assistant. 
      The user's name is ${username}. `;
      
      if (attendanceData) {
        contextPrompt += `Here is the user's attendance data: ${JSON.stringify(attendanceData)}. `;
      }
      
      contextPrompt += `Please respond helpfully to the following query: ${query}`;
      
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          contents: [{
            parts: [{ text: contextPrompt }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Extract the response text from the Gemini API response
      if (response.data && 
          response.data.candidates && 
          response.data.candidates[0] && 
          response.data.candidates[0].content && 
          response.data.candidates[0].content.parts && 
          response.data.candidates[0].content.parts[0]) {
        return response.data.candidates[0].content.parts[0].text;
      } else {
        return "I couldn't generate a response at this time.";
      }
    } catch (error) {
      console.error('Gemini API error:', error);
      return "Sorry, I encountered an error connecting to my intelligence system.";
    }
  };

  const generateLocalResponse = (query: string): string | null => {
    // Check if we have attendance data
    if (!attendanceData) {
      return "Sorry, I don't have access to your attendance data right now.";
    }

    // Handle timetable queries
    if (query.includes('timetable') || query.includes('schedule') || query.includes('class') || query.includes('hour')) {
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayMatch = days.find(day => query.includes(day));
      
      if (dayMatch && attendanceData.timetable && attendanceData.timetable[dayMatch]) {
        const timetable = attendanceData.timetable[dayMatch];
        
        // Check for specific hour queries
        const hourMatch = query.match(/(\d+)(st|nd|rd|th)?\s*hour/);
        if (hourMatch) {
          const hour = parseInt(hourMatch[1]) - 1; // Convert to 0-based index
          if (hour >= 0 && hour < timetable.length) {
            return `Your ${hourMatch[0]} on ${dayMatch.charAt(0).toUpperCase() + dayMatch.slice(1)} is ${timetable[hour]}.`;
          } else {
            return `I don't have information about that hour on ${dayMatch.charAt(0).toUpperCase() + dayMatch.slice(1)}.`;
          }
        }
        
        // Return full day schedule
        return `Your schedule for ${dayMatch.charAt(0).toUpperCase() + dayMatch.slice(1)} is:\n${timetable.map((subject: string, index: number) => `${index + 1}. ${subject}`).join('\n')}`;
      }
    }

    // Handle attendance queries
    if (query.includes('attendance')) {
      // Check for subject-specific attendance
      if (attendanceData.subject_attendance) {
        const subjects = Object.keys(attendanceData.subject_attendance);
        const subjectMatch = subjects.find(subject => 
          query.toLowerCase().includes(subject.toLowerCase())
        );
        
        if (subjectMatch) {
          return `Your attendance for ${subjectMatch} is ${attendanceData.subject_attendance[subjectMatch]}.`;
        }
        
        // Return overall attendance if no specific subject
        return `Here's your attendance breakdown:\n${subjects.map(subject => 
          `${subject}: ${attendanceData.subject_attendance[subject]}`
        ).join('\n')}`;
      }
    }

    // Handle daily attendance queries
    if (query.includes('present') || query.includes('absent') || query.includes('daily attendance')) {
      if (attendanceData.daily_attendance) {
        const days = Object.keys(attendanceData.daily_attendance);
        const statusSummary = days.map(day => {
          const status = attendanceData.daily_attendance[day];
          return `${day}: ${status.join(', ')}`;
        }).join('\n');
        
        return `Here's your daily attendance record:\n${statusSummary}`;
      }
    }

    // For help queries, still handle locally
    if (query.includes('help') || query.includes('what can you do')) {
      return "I can help you with information about your timetable, attendance, and academic records. Try asking questions like 'What's my 3rd hour on Tuesday?' or 'What's my attendance for Mathematics?'";
    }

    // Return null to indicate we should use the Gemini API instead
    return null;
  };

  return (
    <>
      {/* Chatbot toggle button */}
      <button
        className="fixed bottom-6 right-6 bg-white text-black p-4 rounded-full shadow-lg hover:bg-gray-100 transition-colors z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageSquare size={24} />
      </button>

      {/* Chatbot interface */}
      <div
        className={`fixed bottom-24 right-6 w-80 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl transition-all duration-300 z-50 ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="font-bold text-white">AURA Assistant</h3>
          <button 
            className="text-gray-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="p-4 h-80 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.sender === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-white text-black rounded-br-none'
                    : 'bg-gray-800 text-white rounded-bl-none'
                }`}
              >
                {message.text.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < message.text.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="text-left mb-4">
              <div className="inline-block p-3 rounded-lg bg-gray-800 text-white rounded-bl-none">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white"
            />
            <button
              type="submit"
              className="bg-white text-black p-2 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={inputValue.trim() === ''}
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Chatbot;