import React, { useEffect, useState } from 'react';

const SplashScreen = () => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setTimeout(() => setOpacity(1), 100);
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div 
        className={`text-center transition-opacity duration-1000`}
        style={{ opacity }}
      >
        <h1 className="text-8xl font-reospec text-white mb-4 animate-pulse">
          AURA
        </h1>
        <p className="text-gray-400 text-xl">
          Academic Utility and Resource Allocator
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;