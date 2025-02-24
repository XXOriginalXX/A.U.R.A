import React from 'react';
import { Monitor } from 'lucide-react';

const SmartBoard = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
      <Monitor size={64} className="text-gray-600 mb-4" />
      <h2 className="text-2xl font-bold text-gray-400">Smart Board</h2>
      <p className="text-gray-600 mt-2">Coming soon...</p>
    </div>
  );
};

export default SmartBoard;