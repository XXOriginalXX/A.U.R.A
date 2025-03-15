import React from 'react';
import { AlertTriangle } from 'lucide-react';

const Results = () => {
  return (
    <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="text-center">
        <AlertTriangle size={64} className="mx-auto mb-4 text-yellow-500" />
        <h2 className="text-2xl font-bold mb-2">Results Coming Soon</h2>
        <p className="text-gray-400">This feature will be implemented in a future update.</p>
      </div>
    </div>
  );
};

export default Results;