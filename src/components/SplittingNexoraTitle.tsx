import React, { useState, useEffect } from 'react';

interface LetterConfig {
  char: string;
  // 3D vector dispersal multipliers [X, Y, Z, rotX, rotY, rotZ, scale]
  x: number;
  y: number;
  z: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  scale: number;
}

// 6 letters for N - E - X - O - R - A with smooth, elegant 3D vectors
const LETTERS_CONFIG: LetterConfig[] = [
  { char: 'N', x: -240, y: -140, z: -400, rotX: -25, rotY: -40, rotZ: -20, scale: 0.85 },
  { char: 'E', x: -140, y: -80,  z: -420, rotX: 20,  rotY: -25, rotZ: -12, scale: 0.82 },
  { char: 'X', x: 0,    y: -40,  z: -220, rotX: 0,   rotY: 15,  rotZ: 30,  scale: 1.15 },
  { char: 'O', x: 80,   y: 80,   z: -340, rotX: -20, rotY: 20,  rotZ: 18,  scale: 0.82 },
  { char: 'R', x: 150,  y: -80,  z: -380, rotX: 20,  rotY: 25,  rotZ: 15,  scale: 0.82 },
  { char: 'A', x: 250,  y: 130,  z: -400, rotX: 25,  rotY: 40,  rotZ: 25,  scale: 0.85 }
];

export const SplittingNexoraTitle: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Smooth scroll listener
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || window.pageYOffset;
          // Smooth transition from top (0) to entering next section (~360px)
          const progress = Math.min(1, Math.max(0, scrollY / 360));
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobile damp factor
  const dampFactor = isMobile ? 0.45 : 1.0;

  // Fade and blur curves
  const titleOpacity = Math.max(0, 1 - scrollProgress * 1.35);
  const titleBlur = scrollProgress * 12;

  return (
    <div 
      id="hero-nexora-title"
      className="relative w-full py-4 sm:py-6 select-none overflow-visible flex items-center justify-center"
      style={{ 
        perspective: '1000px',
        pointerEvents: scrollProgress > 0.85 ? 'none' : 'auto'
      }}
    >
      {/* Background Soft Cyber Aura */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-[500px] h-24 sm:h-36 rounded-full pointer-events-none transition-all duration-300"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.4) 0%, rgba(56, 189, 248, 0.18) 45%, transparent 75%)',
          filter: `blur(${20 + scrollProgress * 35}px)`,
          opacity: Math.max(0, (1 - scrollProgress * 0.9) * 0.85),
          transform: `translate(-50%, -50%) scale(${1 + scrollProgress * 0.6})`
        }}
      />

      {/* Main Container of Retro Pixel NEXORA Letters */}
      <div 
        className="relative inline-flex items-center justify-center gap-2 sm:gap-4 md:gap-5.5 z-10"
        style={{
          transformStyle: 'preserve-3d'
        }}
      >
        {LETTERS_CONFIG.map((config, idx) => {
          const currentX = config.x * scrollProgress * dampFactor;
          const currentY = config.y * scrollProgress * dampFactor;
          const currentZ = config.z * scrollProgress;
          const currentRotX = config.rotX * scrollProgress;
          const currentRotY = config.rotY * scrollProgress;
          const currentRotZ = config.rotZ * scrollProgress;
          const currentScale = 1 + (config.scale - 1) * scrollProgress;

          return (
            <span
              key={idx}
              id={`nexora-letter-${idx}`}
              className="inline-block text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight select-none relative"
              style={{
                display: 'inline-block',
                willChange: 'transform, opacity, filter',
                transform: `translate3d(${currentX}px, ${currentY}px, ${currentZ}px) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg) rotateZ(${currentRotZ}deg) scale(${currentScale})`,
                opacity: titleOpacity,
                filter: `blur(${titleBlur}px) brightness(${1 + scrollProgress * 1.4}) drop-shadow(0 0 ${10 + scrollProgress * 20}px rgba(56, 189, 248, 0.85))`,
                transition: 'filter 0.08s ease-out',
                transformOrigin: 'center center'
              }}
            >
              {/* Primary Retro Pixel Letter with Cyber Gradient */}
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-sky-500 drop-shadow-[0_0_15px_rgba(56,189,248,0.75)]">
                {config.char}
              </span>

              {/* Holographic Wireframe Ghost during diffusion */}
              {scrollProgress > 0.04 && (
                <span 
                  className="absolute inset-0 font-display font-extrabold text-cyan-300/50 pointer-events-none select-none"
                  style={{
                    transform: `translate(${scrollProgress * (idx % 2 === 0 ? 5 : -5)}px, ${scrollProgress * 3}px)`,
                    opacity: scrollProgress * 0.8,
                    filter: 'blur(2px)'
                  }}
                  aria-hidden="true"
                >
                  {config.char}
                </span>
              )}
            </span>
          );
        })}
      </div>

      {/* Flanking Pixel Brackets */}
      <span 
        className="hidden sm:inline-block absolute -left-6 md:-left-10 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-cyan-400 border border-cyan-200 shadow-[0_0_12px_#38bdf8] rotate-45 transition-all duration-200 pointer-events-none"
        style={{
          transform: `translate3d(${-scrollProgress * 160 * dampFactor}px, -50%, ${-scrollProgress * 350}px) rotate(${45 - scrollProgress * 90}deg) scale(${1 - scrollProgress * 0.8})`,
          opacity: titleOpacity
        }}
      />
      <span 
        className="hidden sm:inline-block absolute -right-6 md:-right-10 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-cyan-400 border border-cyan-200 shadow-[0_0_12px_#38bdf8] rotate-45 transition-all duration-200 pointer-events-none"
        style={{
          transform: `translate3d(${scrollProgress * 160 * dampFactor}px, -50%, ${-scrollProgress * 350}px) rotate(${45 + scrollProgress * 90}deg) scale(${1 - scrollProgress * 0.8})`,
          opacity: titleOpacity
        }}
      />
    </div>
  );
};
