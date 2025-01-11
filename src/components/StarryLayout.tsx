import React from 'react';
import { Linkedin, Github, Menu, X } from 'lucide-react';
import { useState } from 'react';

const StarryLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
  
  // Kept the existing star constellations...
  const orionStars = [/* ... existing Orion stars ... */];
  const cancerStars = [/* ... existing Cancer stars ... */];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Existing background and glow effects */}
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
        className="absolute bottom-0 right-0 w-80 h-80 max-w-full"
        style={{
          background: 'radial-gradient(circle at bottom right, rgba(25, 35, 95, 0.3), transparent 60%)',
          filter: 'blur(60px)',
        }}
      ></div>

      {/* Stars Container - kept existing implementation */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* ... existing constellation and star rendering ... */}
      </div>

      {/* Main Content Container */}
      <div className="relative z-20">
        {/* Navigation - Mobile Responsive */}
        <div className="fixed top-0 left-0 right-0 z-30">
          {/* Mobile Menu Toggle */}
          <div className="md:hidden absolute top-4 right-4">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-blue-200/80 transition-all hover:bg-white/[0.05]"
              style={{
                textShadow: `
                  0 0 5px rgba(0, 24, 82, 0.95),
                  0 0 8px rgba(0, 24, 82, 0.85)
                `
              }}
            >
              {isMenuOpen ? <X size={24} className="opacity-80" /> : <Menu size={24} className="opacity-80" />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex fixed top-8 right-8">
            <div className="flex gap-4 p-4 rounded-xl bg-white/[0.02] backdrop-blur-[2px] border border-white/[0.05]">
              <button 
                className="px-4 py-2 rounded-lg text-sm tracking-widest font-extralight uppercase text-blue-200/80 transition-all hover:bg-white/[0.05] font-['Optima'] relative"
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

          {/* Mobile Menu Overlay */}
          {isMenuOpen && (
            <div className="md:hidden fixed inset-0 bg-black/90 z-20 flex flex-col items-center justify-center">
              <div className="space-y-6 text-center">
                <button 
                  className="block w-full px-6 py-4 text-xl tracking-widest font-extralight uppercase text-blue-200/80 transition-all hover:bg-white/[0.05]"
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
                  className="block w-full px-6 py-4 text-xl tracking-widest font-extralight uppercase text-blue-200/80 transition-all hover:bg-white/[0.05]"
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
                  className="block w-full px-6 py-4 text-xl tracking-widest font-extralight uppercase text-blue-200/80 transition-all hover:bg-white/[0.05]"
                  style={{
                    textShadow: `
                      0 0 5px rgba(0, 24, 82, 0.95),
                      0 0 8px rgba(0, 24, 82, 0.85)
                    `
                  }}
                >
                  About
                </button>
                <div className="flex justify-center gap-8 mt-8">
                  <button 
                    className="p-3 rounded-lg text-blue-200/80 transition-all hover:bg-white/[0.05]"
                    style={{
                      textShadow: `
                        0 0 5px rgba(0, 24, 82, 0.95),
                        0 0 8px rgba(0, 24, 82, 0.85)
                      `
                    }}
                  >
                    <Linkedin size={28} className="opacity-80" />
                  </button>
                  <button 
                    className="p-3 rounded-lg text-blue-200/80 transition-all hover:bg-white/[0.05]"
                    style={{
                      textShadow: `
                        0 0 5px rgba(0, 24, 82, 0.95),
                        0 0 8px rgba(0, 24, 82, 0.85)
                      `
                    }}
                  >
                    <Github size={28} className="opacity-80" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Header Container - Responsive Positioning */}
        <div className="fixed top-20 left-4 right-4 md:left-8">
          <div className="relative">
            {/* DEBO header - Responsive Text Size */}
            <h1 
              className="font-['Optima'] text-3xl md:text-5xl font-bold tracking-widest md:tracking-[0.8em] text-white absolute -top-10 md:-top-14"
              style={{ 
                fontStretch: 'expanded',
                WebkitTextStroke: '0.5px white'
              }}
            >
              DEBO
            </h1>
            
            {/* Role description - Responsive Text Size */}
            <p 
              className="font-['Optima'] text-xs md:text-sm tracking-wide md:tracking-widest font-extralight uppercase whitespace-nowrap"
              style={{
                color: 'rgb(191, 219, 254)',
                textShadow: `
                  0 0 5px rgba(0, 24, 82, 0.95),
                  0 0 8px rgba(0, 24, 82, 0.85),
                  0 0 12px rgba(13, 36, 95, 0.75)
                `
              }}
            >
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

      {/* Footer Note - Responsive */}
      <div className="fixed bottom-1 left-0 right-0 text-center">
        <p 
          className="text-[6px] md:text-[8px] font-['DM_Sans'] text-blue-200/30 tracking-widest"
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