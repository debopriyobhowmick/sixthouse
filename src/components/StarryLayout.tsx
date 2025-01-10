import React from 'react';

const StarryLayout = () => {
  // Generate random positions for blinking stars
  const generateStars = (count: number, isStatic = false) => {
    return Array.from({ length: count }, (_, i) => ({
      id: isStatic ? `static-${i}` : `blinking-${i}`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: !isStatic ? `${Math.random() * 3}s` : undefined,
      size: isStatic ? 'tiny' : (Math.random() < 0.15 ? 'large' : Math.random() < 0.35 ? 'medium' : 'small')
    }));
  };

  const blinkingStars = generateStars(25);
  const staticStars = generateStars(15, true);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Main circular gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              circle at bottom right,
              rgba(0, 20, 65, 1) 0%,
              rgba(0, 20, 65, 0.95) 20%,
              rgba(0, 12, 45, 0.7) 40%,
              rgba(0, 6, 20, 0.4) 60%,
              transparent 80%
            )
          `,
        }}
      ></div>

      {/* Glow effect */}
      <div 
        className="absolute bottom-0 right-0 w-96 h-96"
        style={{
          background: 'radial-gradient(circle at bottom right, rgba(10, 30, 80, 0.6), transparent 70%)',
          filter: 'blur(80px)',
        }}
      ></div>

      {/* Stars Container with higher z-index */}
      <div className="absolute inset-0 z-10">
        {/* Static stars */}
        {staticStars.map((star) => (
          <div
            key={star.id}
            className="absolute"
            style={{
              top: star.top,
              left: star.left,
            }}
          >
            <div
              className="rounded-full bg-white opacity-40"
              style={{
                width: '1px',
                height: '1px',
                boxShadow: '0 0 1px rgba(255, 255, 255, 0.2)',
              }}
            />
          </div>
        ))}

        {/* Blinking stars */}
        {blinkingStars.map((star) => (
          <div
            key={star.id}
            className="absolute"
            style={{
              top: star.top,
              left: star.left,
              animationDelay: star.animationDelay,
            }}
          >
            <div
              className="rounded-full bg-white animate-twinkle"
              style={{
                width: star.size === 'large' ? '3px' : star.size === 'medium' ? '2px' : '1px',
                height: star.size === 'large' ? '3px' : star.size === 'medium' ? '2px' : '1px',
                opacity: 0,
                animation: `twinkle 4s infinite`,
                animationDelay: star.animationDelay,
                boxShadow: star.size === 'large' 
                  ? '0 0 4px 1px rgba(255, 255, 255, 0.8)'
                  : star.size === 'medium'
                  ? '0 0 3px 1px rgba(255, 255, 255, 0.6)'
                  : '0 0 2px 1px rgba(255, 255, 255, 0.4)',
              }}
            />
          </div>
        ))}
      </div>

      {/* Main Content Container */}
      <div className="relative z-20">
        {/* Header Container - Fixed position in top left */}
        <div className="fixed top-20 left-8">
          <div className="relative">
            {/* DEBO header */}
            <h1 className="font-['Optima'] text-5xl font-bold tracking-[0.8em] text-white absolute -top-14"
                style={{ 
                  fontStretch: 'expanded',
                  WebkitTextStroke: '0.5px white'
                }}>
              DEBO
            </h1>
            
            {/* Role description */}
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
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default StarryLayout;