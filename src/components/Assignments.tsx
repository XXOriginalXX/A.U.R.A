import React, { useState } from 'react';
import { BookOpen, FileText, Loader2 } from 'lucide-react';
import axios from 'axios';

const Assignments: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [numPages, setNumPages] = useState(1);
  const [assignment, setAssignment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Hardcoded API Key
  const COHERE_API_KEY = 'EAZ2ZzlUa72S8HWib7ZFZYIa5gEQGQx3ltFKCG97';

  const handleGenerateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const prompt = `Generate an assignment on the topic "${topic}" for the subject "${subjectName}" (Code: ${subjectCode}). The assignment should be approximately ${numPages} pages long.`;

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

      setAssignment(response.data.generations[0].text);
    } catch (error) {
      console.error('Error generating assignment:', error);
      setAssignment('Failed to generate assignment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col items-center p-6">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-full mb-4">
            <BookOpen size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Assignment Assistant
          </h1>
          <p className="text-gray-400 mt-2 text-center max-w-lg">
            Professional academic assignments with AI assistance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <div className="md:col-span-1 bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <FileText size={20} className="mr-2 text-blue-400" />
              Assignment Details
            </h2>
            
            <form onSubmit={handleGenerateAssignment} className="space-y-5">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Assignment Topic
                </label>
                <input 
                  type="text" 
                  value={topic} 
                  onChange={(e) => setTopic(e.target.value)} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  placeholder="e.g., Climate Change"
                  required 
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Subject Name
                </label>
                <input 
                  type="text" 
                  value={subjectName} 
                  onChange={(e) => setSubjectName(e.target.value)} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  placeholder="e.g., Environmental Science"
                  required 
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Subject Code
                </label>
                <input 
                  type="text" 
                  value={subjectCode} 
                  onChange={(e) => setSubjectCode(e.target.value)} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  placeholder="e.g., ENV101"
                  required 
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Number of Pages
                </label>
                <input 
                  type="number" 
                  value={numPages} 
                  onChange={(e) => setNumPages(Number(e.target.value))} 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  min="1"
                  required 
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium transition-all hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 flex justify-center items-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  'Generate Assignment'
                )}
              </button>
            </form>
          </div>
          
          <div className="md:col-span-2">
            <div className="bg-gray-900 rounded-xl p-6 shadow-lg h-full border border-gray-800">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <FileText size={20} className="mr-2 text-purple-400" />
                Generated Assignment
              </h2>
              
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <Loader2 size={40} className="animate-spin text-blue-500 mb-4" />
                  <p className="text-gray-400">Generating your assignment...</p>
                </div>
              ) : assignment ? (
                <div className="bg-gray-800 rounded-lg p-5 overflow-auto max-h-[60vh]">
                  <pre className="whitespace-pre-wrap text-gray-300 font-sans">{assignment}</pre>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <FileText size={40} className="mb-4 opacity-30" />
                  <p className="text-center">Your generated assignment will appear here</p>
                  <p className="text-sm mt-2 text-center">Fill out the form and click "Generate Assignment"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignments;
