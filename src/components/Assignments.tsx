import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import axios from 'axios';

const Assignments: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [subjectName, setSubjectName] = useState<string>('');
  const [subjectCode, setSubjectCode] = useState<string>('');
  const [numPages, setNumPages] = useState<number>(1);
  const [assignment, setAssignment] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Cohere API key hardcoded in the file
  const COHERE_API_KEY = 'EAZ2ZzlUa72S8HWib7ZFZYIa5gEQGQx3ltFKCG97';

  const handleGenerateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Construct the prompt for Cohere
      const prompt = `Generate an assignment on the topic "${topic}" for the subject "${subjectName}" (Code: ${subjectCode}). The assignment should be approximately ${numPages} pages long.`;

      // Call the Cohere API
      const response = await axios.post(
        'https://api.cohere.ai/v1/generate',
        {
          prompt: prompt,
          max_tokens: 1000, // Adjust based on your needs
          temperature: 0.7, // Adjust creativity level
        },
        {
          headers: {
            'Authorization': `Bearer ${COHERE_API_KEY}`, // Fixed interpolation issue
            'Content-Type': 'application/json',
          },
        }
      );

      // Set the generated assignment
      setAssignment(response.data.generations[0].text);
    } catch (error) {
      console.error('Error generating assignment:', error);
      setAssignment('Failed to generate assignment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] p-4">
      <BookOpen size={64} className="text-gray-600 mb-4" />
      <h2 className="text-2xl font-bold text-gray-400 mb-4">Assignment Generator</h2>

      {/* Form for user inputs */}
      <form onSubmit={handleGenerateAssignment} className="w-full max-w-md">
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Assignment Topic:</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Subject Name:</label>
          <input
            type="text"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Subject Code:</label>
          <input
            type="text"
            value={subjectCode}
            onChange={(e) => setSubjectCode(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Number of Pages:</label>
          <input
            type="number"
            value={numPages}
            onChange={(e) => setNumPages(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
            min="1"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? 'Generating...' : 'Generate Assignment'}
        </button>
      </form>

      {/* Display the generated assignment */}
      {assignment && (
        <div className="mt-8 w-full max-w-2xl bg-gray-100 p-4 rounded">
          <h3 className="text-xl font-bold text-gray-700 mb-4">Generated Assignment:</h3>
          <pre className="whitespace-pre-wrap text-gray-800">{assignment}</pre>
        </div>
      )}
    </div>
  );
};

export default Assignments;
