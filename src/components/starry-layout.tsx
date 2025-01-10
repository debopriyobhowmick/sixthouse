import React from 'react';

const StarryLayout = () => {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Main circular gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              circle at bottom right,
              rgba(0, 24, 82, 1) 0%,
              rgba(0, 24, 82, 0.95) 20%,
              rgba(0, 16, 54, 0.7) 40%,
              rgba(0, 8, 27, 0.4) 60%,
              transparent 80%
            )
          `,
        }}
      ></div>

      {/* Glow effect */}
      <div 
        className="absolute bottom-0 right-0 w-[1200px] h-[1200px]"
        style={{
          background: 'radial-gradient(circle at bottom right, rgba(13, 36, 95, 0.6), transparent 70%)',
          filter: 'blur(80px)',
        }}
      ></div>

      {/* Main Content Container */}
      <div className="relative z-10 container mx-auto px-4">
        {/* Top Left Header Content */}
        <div className="pt-20 pl-8">
          <div className="inline-flex flex-col">
            <div className="relative">
              <p className="text-sm tracking-widest font-extralight uppercase whitespace-nowrap"
                 style={{
                   color: 'rgb(191, 219, 254)',
                   textShadow: `
                     0 0 5px rgba(0, 24, 82, 0.95),
                     0 0 8px rgba(0, 24, 82, 0.85),
                     0 0 12px rgba(13, 36, 95, 0.75)
                   `
                 }}>
                Full Stack Data Scientist
              </p>
              <h1 className="font-['Optima'] text-5xl font-bold tracking-[0.8em] text-white absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap" 
                  style={{ 
                    fontStretch: 'expanded',
                    WebkitTextStroke: '0.5px white'
                  }}>
                DEBO
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StarryLayout;