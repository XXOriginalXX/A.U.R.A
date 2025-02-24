import React, { useEffect, useState } from 'react';

const SplashScreen = () => {
  const [progress, setProgress] = useState(0);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setTimeout(() => setOpacity(1), 100);

    const duration = 4000; // 4 seconds for the full animation
    const startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const newProgress = Math.min(elapsed / duration, 1);

      setProgress(newProgress);

      if (newProgress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div 
        className="text-center transition-all duration-1000"
        style={{ opacity }}
      >
        <div className="relative">
          <h1 className="text-8xl font-reospec mb-4 text-white overflow-hidden">
            AURA
            <div 
              className="absolute inset-0 bg-black" 
              style={{ 
                transform: `translateX(${progress * 100}%)`,
                transition: 'transform 0.1s linear'
              }}
            />
          </h1>
        </div>
        <p 
          className="text-gray-400 text-xl"
          style={{ 
            opacity: progress > 0.5 ? (progress - 0.5) * 2 : 0,
            transform: `translateY(${20 - progress * 20}px)`,
            transition: 'all 0.3s ease-out'
          }}
        >
          Academic Utility and Resource Allocator
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
