import React from 'react';
import { Linkedin, Github } from 'lucide-react';

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
  
  // Orion constellation stars - rotated 30 degrees clockwise
  const orionStars = [
    // Primary Stars
    { id: 'betelgeuse', x: 86, y: 14, name: 'Betelgeuse', primary: true },    // Alpha Orionis
    { id: 'rigel', x: 89, y: 24, name: 'Rigel', primary: true },              // Beta Orionis
    { id: 'bellatrix', x: 83, y: 16, name: 'Bellatrix', primary: true },      // Gamma Orionis
    { id: 'mintaka', x: 88, y: 20, name: 'Mintaka', primary: true },          // Delta Orionis
    { id: 'alnilam', x: 86, y: 19, name: 'Alnilam', primary: true },          // Epsilon Orionis
    { id: 'alnitak', x: 84, y: 18, name: 'Alnitak', primary: true },          // Zeta Orionis
    { id: 'saiph', x: 84, y: 24, name: 'Saiph', primary: true },              // Kappa Orionis
    { id: 'meissa', x: 85, y: 12, name: 'Meissa', primary: true },            // Lambda Orionis
    { id: 'tabit', x: 82, y: 17, name: 'Tabit', primary: true },              // Pi3 Orionis

    // Additional Stars
    { id: 'eta', x: 87, y: 22, name: 'Eta Orionis' },                         // Below belt
    { id: 'phi', x: 87, y: 17, name: 'Phi Orionis' },                         // Above belt
    { id: 'omega', x: 85, y: 22, name: 'Omega Orionis' },                     // Below belt
    { id: 'nu', x: 84, y: 16, name: 'Nu Orionis' },                          // Above belt
    { id: 'xi', x: 88, y: 16, name: 'Xi Orionis' },                          // Right side
    { id: 'mu', x: 83, y: 22, name: 'Mu Orionis' },                          // Left side
    { id: 'chi', x: 86, y: 15, name: 'Chi Orionis' }                         // Upper region
  ];

  // Cancer constellation stars
  const cancerStars = [
    // Main Y-shape
    { id: 'acubens', x: 15, y: 16, primary: true },      // Alpha Cancri
    { id: 'altarf', x: 13, y: 18, primary: true },       // Beta Cancri
    { id: 'asellus-borealis', x: 17, y: 20, primary: true }, // Gamma Cancri
    { id: 'asellus-australis', x: 15, y: 22, primary: true }, // Delta Cancri
    
    // Additional cluster stars
    { id: 'c-iota', x: 14, y: 17 },
    { id: 'c-chi', x: 16, y: 19 },
    { id: 'c-theta', x: 18, y: 18 },
    { id: 'c-eta', x: 12, y: 19 },
    { id: 'c-gamma', x: 16, y: 21 }
  ];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Main circular gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              circle at bottom right,
              rgba(16, 24, 79, 0.95) 0%,
              rgba(13, 20, 68, 0.9) 8%,
              rgba(12, 18, 65, 0.8) 16%,
              rgba(10, 16, 57, 0.6) 28%,
              rgba(9, 14, 50, 0.4) 40%,
              rgba(8, 12, 45, 0.2) 52%,
              transparent 65%
            )
          `,
        }}
      ></div>

      {/* Glow effect */}
      <div 
        className="absolute bottom-0 right-0 w-80 h-80"
        style={{
          background: 'radial-gradient(circle at bottom right, rgba(25, 35, 95, 0.3), transparent 60%)',
          filter: 'blur(60px)',
        }}
      ></div>

      {/* Stars Container with higher z-index */}
      <div className="absolute inset-0 z-10">
        {/* Cancer Constellation */}
        {cancerStars.map((star) => (
          <div
            key={star.id}
            className="absolute"
            style={{
              top: `${star.y}%`,
              left: `${star.x}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div
              className="rounded-full bg-white"
              style={{
                width: star.primary ? '2px' : '1px',
                height: star.primary ? '2px' : '1px',
                opacity: star.primary ? 0.5 : 0.3,
                boxShadow: star.primary 
                  ? '0 0 1.5px 0.5px rgba(255, 255, 255, 0.3)'
                  : '0 0 1px 0px rgba(255, 255, 255, 0.2)',
              }}
            />
          </div>
        ))}

        {/* Orion Constellation */}
        {orionStars.map((star) => (
          <div
            key={star.id}
            className="absolute"
            style={{
              top: `${star.y}%`,
              left: `${star.x}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div
              className="rounded-full bg-white"
              style={{
                width: star.primary ? '2px' : '1px',
                height: star.primary ? '2px' : '1px',
                opacity: star.primary ? 0.65 : 0.4,
                boxShadow: star.primary 
                  ? '0 0 1.5px 0.5px rgba(255, 255, 255, 0.4)'
                  : '0 0 1px 0px rgba(255, 255, 255, 0.3)',
              }}
            />
          </div>
        ))}

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
        {/* Navigation Bento Box */}
        <div className="fixed top-8 right-8">
          <div className="flex gap-4 p-4 rounded-xl bg-white/[0.02] backdrop-blur-[2px] border border-white/[0.05]">
            <button 
              className="px-4 py-2 rounded-lg text-sm tracking-widest font-extralight uppercase text-blue-200/80 transition-all hover:bg-white/[0.05] font-['Optima']"
              style={{
                textShadow: `
                  0 0 5px rgba(0, 24, 82, 0.95),
                  0 0 8px rgba(0, 24, 82, 0.85)
                `
              }}
            >
              Projects
            </button>
            <button 
              className="px-4 py-2 rounded-lg text-sm tracking-widest font-extralight uppercase text-blue-200/80 transition-all hover:bg-white/[0.05]"
              style={{
                textShadow: `
                  0 0 5px rgba(0, 24, 82, 0.95),
                  0 0 8px rgba(0, 24, 82, 0.85)
                `
              }}
            >
              Resume
            </button>
            <button 
              className="px-4 py-2 rounded-lg text-sm tracking-widest font-extralight uppercase text-blue-200/80 transition-all hover:bg-white/[0.05]"
              style={{
                textShadow: `
                  0 0 5px rgba(0, 24, 82, 0.95),
                  0 0 8px rgba(0, 24, 82, 0.85)
                `
              }}
            >
              About
            </button>
            <div className="h-6 w-px bg-white/[0.05] my-auto"></div>
            <button 
              className="p-2 rounded-lg text-blue-200/80 transition-all hover:bg-white/[0.05]"
              style={{
                textShadow: `
                  0 0 5px rgba(0, 24, 82, 0.95),
                  0 0 8px rgba(0, 24, 82, 0.85)
                `
              }}
            >
              <Linkedin size={20} className="opacity-80" />
            </button>
            <button 
              className="p-2 rounded-lg text-blue-200/80 transition-all hover:bg-white/[0.05]"
              style={{
                textShadow: `
                  0 0 5px rgba(0, 24, 82, 0.95),
                  0 0 8px rgba(0, 24, 82, 0.85)
                `
              }}
            >
              <Github size={20} className="opacity-80" />
            </button>
          </div>
        </div>

        {/* Header Container - Fixed position in top left */}
        <div className="fixed top-20 left-8">
          <div className="relative">
            {/* DEBO header */}
            <h1 className="font-['Optima'] text-5xl font-bold tracking-[0.8em] text-white absolute -top-20"
                style={{ 
                  fontStretch: 'expanded',
                  WebkitTextStroke: '0.5px white'
                }}>
              DEBO
            </h1>
            
            {/* Role description */}
            <p className="font-['Optima'] text-sm tracking-widest font-extralight uppercase whitespace-nowrap"
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

      {/* Footer Note */}
      <div className="fixed bottom-1 left-0 right-0 text-center">
        <p 
          className="text-[8px] font-['DM_Sans'] text-blue-200/30 tracking-widest"
          style={{
            textShadow: `
              0 0 1px rgba(0, 24, 82, 0.3),
              0 0 2px rgba(0, 24, 82, 0.2)
            `
          }}
        >
          Made with ❤️ in New York City
        </p>
      </div>
    </div>
  );
};

export default StarryLayout;