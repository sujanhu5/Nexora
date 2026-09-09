import React from 'react';
import { Galaxy } from './Galaxy';

export const GraphicalAnimationBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-black flex items-center justify-center">
      {/* Deep Celestial Nebula Radial Aura */}
      <div 
        className="pointer-events-none fixed top-0 left-0 w-full h-[100vh] -z-10"
        style={{
          background: 'radial-gradient(circle at 50% 12%, rgba(56, 189, 248, 0.18) 0%, rgba(14, 165, 233, 0.05) 38%, transparent 75%)'
        }}
        aria-hidden="true"
      />

      {/* 1080x1080 Galaxy Container */}
      <div 
        style={{ width: '1080px', height: '1080px', position: 'relative' }}
        className="flex-shrink-0 scale-100 sm:scale-110 md:scale-125 lg:scale-150 xl:scale-[1.75] transition-transform duration-700"
      >
        <Galaxy
          starSpeed={0.5}
          density={0.5}
          hueShift={140}
          speed={1}
          glowIntensity={0.3}
          saturation={0}
          mouseRepulsion
          repulsionStrength={1.5}
          twinkleIntensity={0.3}
          rotationSpeed={0.1}
          transparent
        />
      </div>
    </div>
  );
};
