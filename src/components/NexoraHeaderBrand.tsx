import React from 'react';

interface NexoraHeaderBrandProps {
  className?: string;
  imgClassName?: string;
}

/**
 * NexoraHeaderBrand:
 * Renders the official NEXORA celestial emblem logo:
 * - Glowing celestial wireframe globe with orbital planetary ring and NEXORA in lower hemisphere
 */
export const NexoraHeaderBrand: React.FC<NexoraHeaderBrandProps> = ({
  className = '',
  imgClassName = 'h-10 sm:h-11 md:h-12 w-auto'
}) => {
  return (
    <div className={`relative flex items-center select-none ${className}`}>
      <img
        src="/nexora-logo.svg"
        alt="NEXORA Logo"
        className={`${imgClassName} object-contain transition-all duration-300 drop-shadow-[0_0_12px_rgba(56,189,248,0.5)] group-hover:drop-shadow-[0_0_20px_rgba(56,189,248,0.85)] group-hover:scale-105`}
        referrerPolicy="no-referrer"
        loading="eager"
      />
    </div>
  );
};
