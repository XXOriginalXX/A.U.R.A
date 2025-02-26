import React from 'react';
import { Monitor } from 'lucide-react';

const SmartBoard = () => {
  const handleLaunch = () => {
    window.open("https://a-u-r-a-smartboard.netlify.app/", "_blank");
  };

  return (
    <div 
      className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] cursor-pointer"
      onClick={handleLaunch}
    >
      <Monitor size={64} className="text-gray-600 mb-4" />
      <h2 className="text-2xl font-bold text-gray-400">Smart Board</h2>
      <p className="text-gray-600 mt-2">Click to Launch</p>
    </div>
  );
};

export default SmartBoard;
