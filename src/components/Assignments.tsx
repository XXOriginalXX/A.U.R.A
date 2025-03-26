import React, { useState } from 'react';
import { BookOpen, FileText, Loader2, Info, Target, User, Clock, Lightbulb, Search, BookmarkPlus } from 'lucide-react';
import axios from 'axios';

interface AssignmentQuery {
  topic: string;
  subjectName: string;
  subjectCode: string;
  numPages: number;
}

const AssignmentAssistant: React.FC = () => {
  // Hardcoded API Key
  const COHERE_API_KEY = 'EAZ2ZzlUa72S8HWib7ZFZYIa5gEQGQx3ltFKCG97';

  const [assignmentQuery, setAssignmentQuery] = useState<AssignmentQuery>({
    topic: '',
    subjectName: '',
    subjectCode: '',
    numPages: 1
  });

  const [assistantAdvice, setAssistantAdvice] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const prompt = `Provide comprehensive academic guidance for an assignment with these details:
      - Topic: "${assignmentQuery.topic}"
      - Subject: "${assignmentQuery.subjectName}"
      - Subject Code: ${assignmentQuery.subjectCode}
      - Approximate Length: ${assignmentQuery.numPages} pages

      Guidance should include:
      1. Research approach and strategies
      2. Key areas to explore in the assignment
      3. Potential challenges and how to overcome them
      4. Recommended resources and references
      5. Structural advice for the assignment
      6. Critical questions to address
      7. Tips for achieving a high-quality submission

      Focus on providing insightful, actionable academic advice that helps a student approach the assignment effectively.`;

      const response = await axios.post(
        'https://api.cohere.ai/v1/generate',
        {
          model: 'command', // Specify the correct model
          prompt: prompt,
          max_tokens: 1000,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${COHERE_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setAssistantAdvice(response.data.generations[0].text);
    } catch (error) {
      console.error('Error generating assignment assistance:', error);
      setAssistantAdvice('Failed to generate assistance. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col items-center p-6">
      <div className="w-full max-w-5xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-full mb-4">
            <Lightbulb size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            AI Assignment Assistant
          </h1>
          <p className="text-gray-400 mt-2 text-center">
            Personalized academic guidance and strategic support
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Assignment Query Form */}
          <div className="md:col-span-1 bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800">
            <form onSubmit={handleGenerateAssignment} className="space-y-5">
              <div>
                <label className="flex items-center text-gray-400 text-sm font-medium mb-2">
                  <Target size={16} className="mr-2 text-blue-400" /> Assignment Topic
                </label>
                <input 
                  type="text" 
                  value={assignmentQuery.topic} 
                  onChange={(e) => setAssignmentQuery({...assignmentQuery, topic: e.target.value})} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  placeholder="e.g., Machine Learning Ethics"
                  required 
                />
              </div>
              
              <div>
                <label className="flex items-center text-gray-400 text-sm font-medium mb-2">
                  <BookOpen size={16} className="mr-2 text-green-400" /> Subject Name
                </label>
                <input 
                  type="text" 
                  value={assignmentQuery.subjectName} 
                  onChange={(e) => setAssignmentQuery({...assignmentQuery, subjectName: e.target.value})} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  placeholder="e.g., Computer Science Ethics"
                  required 
                />
              </div>
              
              <div>
                <label className="flex items-center text-gray-400 text-sm font-medium mb-2">
                  <Info size={16} className="mr-2 text-purple-400" /> Subject Code
                </label>
                <input 
                  type="text" 
                  value={assignmentQuery.subjectCode} 
                  onChange={(e) => setAssignmentQuery({...assignmentQuery, subjectCode: e.target.value})} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  placeholder="e.g., CS-Ethics-401"
                  required 
                />
              </div>
              
              <div>
                <label className="flex items-center text-gray-400 text-sm font-medium mb-2">
                  <Clock size={16} className="mr-2 text-yellow-400" /> Number of Pages
                </label>
                <input 
                  type="number" 
                  value={assignmentQuery.numPages} 
                  onChange={(e) => setAssignmentQuery({...assignmentQuery, numPages: Number(e.target.value)})} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  min="1"
                  required 
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium transition-all hover:from-blue-700 hover:to-purple-700 disabled:opacity-70 flex justify-center items-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin mr-2" />
                    Getting Assistance...
                  </>
                ) : (
                  'Get Assignment Assistance'
                )}
              </button>
            </form>
          </div>
          
          {/* Assistant Advice Display */}
          <div className="md:col-span-2 bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800 overflow-auto max-h-[70vh]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 size={40} className="animate-spin text-blue-500 mb-4" />
                <p className="text-gray-400">Generating personalized academic guidance...</p>
              </div>
            ) : assistantAdvice ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-blue-400 border-b border-gray-700 pb-3">
                  Assignment Assistance
                </h2>
                <pre className="whitespace-pre-wrap text-gray-300 font-sans text-base leading-relaxed">
                  {assistantAdvice}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Lightbulb size={40} className="mb-4 opacity-30" />
                <p className="text-center">Your personalized assignment guidance will appear here</p>
                <p className="text-sm mt-2 text-center">Fill out the details and click "Get Assignment Assistance"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentAssistant;