import React from 'react';

interface NexoraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showWordmark?: boolean;
  animated?: boolean;
}

/**
 * NexoraLogo: High-fidelity celestial orbital globe and stylized chrome wordmark
 * modeled directly on the official NEXORA emblem:
 * - 3D Constellation wireframe sphere with interconnected node vertices
 * - Sparkling starlight lens flares at node intersections
 * - Radiant luminous planetary orbital ring tilted diagonally
 * - Precision metallic chrome typography with slashed 'X' and chevron 'Λ'
 */
export const NexoraLogo: React.FC<NexoraLogoProps> = ({
  className = '',
  size = 'md',
  showWordmark = true,
  animated = true
}) => {
  // Dimensions map
  const sizeMap = {
    sm: { width: 140, height: 40, iconSize: 34, fontSize: 18 },
    md: { width: 190, height: 50, iconSize: 44, fontSize: 22 },
    lg: { width: 260, height: 68, iconSize: 58, fontSize: 30 },
    xl: { width: 340, height: 90, iconSize: 80, fontSize: 40 },
    hero: { width: 440, height: 440, iconSize: 380, fontSize: 52 }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  if (size === 'hero') {
    // Majestic hero centerpiece emblem
    return (
      <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
        {/* Deep ambient cosmic glow */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.28) 0%, rgba(14, 165, 233, 0.12) 40%, rgba(2, 6, 23, 0) 70%)',
            filter: 'blur(36px)',
            transform: 'scale(1.3)'
          }}
        />

        <svg
          viewBox="0 0 500 500"
          className={`w-72 sm:w-96 md:w-[440px] h-72 sm:h-96 md:h-[440px] drop-shadow-[0_0_35px_rgba(56,189,248,0.45)] ${animated ? 'hover:scale-105 transition-transform duration-500 ease-out' : ''}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Chrome metallic gradient for wordmark */}
            <linearGradient id="chromeMetallicHero" x1="250" y1="210" x2="250" y2="285" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="28%" stopColor="#e2e8f0" />
              <stop offset="48%" stopColor="#94a3b8" />
              <stop offset="52%" stopColor="#f8fafc" />
              <stop offset="75%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>

            {/* Glowing cyan-silver orbital ring gradient */}
            <linearGradient id="orbitalRingGrad" x1="50" y1="180" x2="450" y2="320" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.85" />
              <stop offset="25%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="50%" stopColor="#bae6fd" stopOpacity="0.95" />
              <stop offset="75%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.6" />
            </linearGradient>

            {/* Wireframe sphere glow */}
            <linearGradient id="wireframeGlow" x1="120" y1="120" x2="380" y2="380" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#bae6fd" stopOpacity="0.75" />
              <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
            </linearGradient>

            {/* Core sphere rim halo */}
            <radialGradient id="sphereCoreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="70%" stopColor="#000000" stopOpacity="0" />
              <stop offset="92%" stopColor="#38bdf8" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
            </radialGradient>

            {/* Soft bloom filter */}
            <filter id="bloomFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Star flare sparkle */}
            <g id="starNode">
              <circle cx="0" cy="0" r="2.2" fill="#ffffff" />
              <circle cx="0" cy="0" r="4.5" fill="#bae6fd" opacity="0.6" />
              {/* 4-point star diamond spikes */}
              <path d="M0 -9 L0 9 M-9 0 L9 0" stroke="#ffffff" strokeWidth="1" opacity="0.95" strokeLinecap="round" />
            </g>
          </defs>

          {/* BACKGROUND: Back portion of Orbital Ring (passes behind globe) */}
          <g transform="rotate(-21 250 250)" opacity="0.75">
            <path
              d="M 55 250 A 215 48 0 0 1 445 250"
              stroke="url(#orbitalRingGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              filter="url(#bloomFilter)"
            />
            <path
              d="M 65 250 A 205 40 0 0 1 435 250"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeOpacity="0.9"
            />
          </g>

          {/* SPHERE: Outer Sphere Silhouette & Atmosphere Rim */}
          <circle
            cx="250"
            cy="250"
            r="124"
            fill="#01040a"
            stroke="url(#wireframeGlow)"
            strokeWidth="2.8"
            filter="url(#bloomFilter)"
          />
          <circle
            cx="250"
            cy="250"
            r="123"
            fill="url(#sphereCoreGlow)"
          />

          {/* CONSTELLATION NETWORK & WIREFRAME MESH */}
          <g stroke="url(#wireframeGlow)" strokeLinecap="round" opacity="0.82">
            {/* Latitude Parallels */}
            <ellipse cx="250" cy="250" rx="124" ry="124" strokeWidth="1.5" />
            <ellipse cx="250" cy="205" rx="116" ry="46" strokeWidth="1.2" strokeOpacity="0.75" />
            <ellipse cx="250" cy="295" rx="116" ry="46" strokeWidth="1.2" strokeOpacity="0.75" />
            <ellipse cx="250" cy="165" rx="94" ry="32" strokeWidth="1.0" strokeOpacity="0.65" />
            <ellipse cx="250" cy="335" rx="94" ry="32" strokeWidth="1.0" strokeOpacity="0.65" />

            {/* Longitude Arcs */}
            <ellipse cx="250" cy="250" rx="42" ry="124" strokeWidth="1.2" strokeOpacity="0.8" />
            <ellipse cx="250" cy="250" rx="86" ry="124" strokeWidth="1.2" strokeOpacity="0.8" />

            {/* Diagonal Constellation Interconnect Chords */}
            <path d="M 160 175 Q 230 210 340 185" strokeWidth="1.1" strokeOpacity="0.7" />
            <path d="M 140 250 Q 210 270 360 250" strokeWidth="1.1" strokeOpacity="0.7" />
            <path d="M 155 315 Q 260 290 345 320" strokeWidth="1.1" strokeOpacity="0.7" />
            <path d="M 190 145 L 310 355" strokeWidth="0.9" strokeOpacity="0.55" />
            <path d="M 310 145 L 190 355" strokeWidth="0.9" strokeOpacity="0.55" />
            <path d="M 215 130 Q 295 240 220 370" strokeWidth="0.9" strokeOpacity="0.6" />
            <path d="M 285 130 Q 205 240 280 370" strokeWidth="0.9" strokeOpacity="0.6" />
            <path d="M 135 220 Q 250 160 365 220" strokeWidth="1.0" strokeOpacity="0.6" />
            <path d="M 135 280 Q 250 340 365 280" strokeWidth="1.0" strokeOpacity="0.6" />
          </g>

          {/* SPARKLING STAR NODES AT VERTICES */}
          <g>
            <use href="#starNode" x="205" y="165" />
            <use href="#starNode" x="295" y="165" />
            <use href="#starNode" x="250" y="130" />
            <use href="#starNode" x="160" y="205" />
            <use href="#starNode" x="340" y="205" />
            <use href="#starNode" x="210" y="205" />
            <use href="#starNode" x="290" y="205" />
            <use href="#starNode" x="135" y="250" />
            <use href="#starNode" x="365" y="250" />
            <use href="#starNode" x="175" y="260" />
            <use href="#starNode" x="325" y="260" />
            <use href="#starNode" x="165" y="295" />
            <use href="#starNode" x="335" y="295" />
            <use href="#starNode" x="210" y="295" />
            <use href="#starNode" x="290" y="295" />
            <use href="#starNode" x="205" y="335" />
            <use href="#starNode" x="295" y="335" />
            <use href="#starNode" x="250" y="370" />
            <use href="#starNode" x="250" y="215" />
            <use href="#starNode" x="250" y="285" />
          </g>

          {/* FOREGROUND: Front portion of Orbital Ring (sweeps in front of globe) */}
          <g transform="rotate(-21 250 250)">
            {/* Wide soft bloom flare */}
            <path
              d="M 445 250 A 215 48 0 0 1 55 250"
              stroke="#38bdf8"
              strokeWidth="11"
              strokeLinecap="round"
              opacity="0.35"
              filter="url(#bloomFilter)"
            />
            {/* Primary glowing ring */}
            <path
              d="M 445 250 A 215 48 0 0 1 55 250"
              stroke="url(#orbitalRingGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              filter="url(#bloomFilter)"
            />
            {/* Bright diamond core */}
            <path
              d="M 440 250 A 210 44 0 0 1 60 250"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Ring Tip Star Flare */}
            <circle cx="58" cy="250" r="3" fill="#ffffff" />
            <circle cx="442" cy="250" r="3" fill="#ffffff" />
            <path d="M 58 240 L 58 260 M 48 250 L 68 250" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 442 240 L 442 260 M 432 250 L 452 250" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
          </g>

          {/* CENTER WORDMARK: NEXORA (Metallic Chrome Typography) */}
          <g transform="translate(250 258) rotate(-21) translate(-250 -258)">
            {/* Text drop shadow / glow backing */}
            <text
              x="250"
              y="266"
              textAnchor="middle"
              fontFamily="'Syne', 'Space Grotesk', system-ui, sans-serif"
              fontWeight="900"
              fontSize="48"
              letterSpacing="7"
              fill="#000000"
              stroke="#01040a"
              strokeWidth="8"
            >
              NEXORA
            </text>

            {/* Outer metallic chrome stroke */}
            <text
              x="250"
              y="266"
              textAnchor="middle"
              fontFamily="'Syne', 'Space Grotesk', system-ui, sans-serif"
              fontWeight="900"
              fontSize="48"
              letterSpacing="7"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              filter="url(#bloomFilter)"
            >
              NEXORA
            </text>

            {/* Inner fill with metallic chrome */}
            <text
              x="250"
              y="266"
              textAnchor="middle"
              fontFamily="'Syne', 'Space Grotesk', system-ui, sans-serif"
              fontWeight="900"
              fontSize="48"
              letterSpacing="7"
              fill="url(#chromeMetallicHero)"
            >
              NEXORA
            </text>

            {/* Iconic Sharp Slash Cutting Through 'X' */}
            <path
              d="M 215 288 L 265 220"
              stroke="#ffffff"
              strokeWidth="3.2"
              strokeLinecap="round"
              filter="url(#bloomFilter)"
            />
            <path
              d="M 215 288 L 265 220"
              stroke="#38bdf8"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>
    );
  }

  // Standard Header / Card / Modal Emblem with Wordmark
  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Planetary Constellation Sphere with Ring */}
      <div 
        className="relative flex-shrink-0 flex items-center justify-center group"
        style={{ width: currentSize.iconSize, height: currentSize.iconSize }}
      >
        {/* Soft cyan bloom */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity"
          style={{
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.4) 0%, transparent 70%)',
            filter: 'blur(6px)'
          }}
        />

        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(56,189,248,0.5)] group-hover:scale-105 transition-transform duration-300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`ringGradSmall-${size}`} x1="10" y1="35" x2="90" y2="65" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <linearGradient id={`wireframeGradSmall-${size}`} x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#7dd3fc" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Back half of tilted ring */}
          <g transform="rotate(-21 50 50)">
            <path
              d="M 12 50 A 42 10 0 0 1 88 50"
              stroke={`url(#ringGradSmall-${size})`}
              strokeWidth="2.2"
              strokeOpacity="0.7"
            />
          </g>

          {/* Central dark globe with wireframe */}
          <circle cx="50" cy="50" r="26" fill="#000000" stroke={`url(#wireframeGradSmall-${size})`} strokeWidth="1.2" />
          
          {/* Wireframe parallels & meridians */}
          <g stroke={`url(#wireframeGradSmall-${size})`} strokeWidth="0.8" strokeOpacity="0.75">
            <ellipse cx="50" cy="42" rx="24" ry="10" />
            <ellipse cx="50" cy="58" rx="24" ry="10" />
            <ellipse cx="50" cy="50" rx="10" ry="26" />
            <ellipse cx="50" cy="50" rx="18" ry="26" />
            <path d="M 32 35 L 68 65" strokeWidth="0.6" strokeOpacity="0.5" />
            <path d="M 68 35 L 32 65" strokeWidth="0.6" strokeOpacity="0.5" />
          </g>

          {/* Sparkling vertex stars */}
          <circle cx="50" cy="24" r="1.2" fill="#ffffff" />
          <circle cx="50" cy="76" r="1.2" fill="#ffffff" />
          <circle cx="32" cy="42" r="1.2" fill="#bae6fd" />
          <circle cx="68" cy="42" r="1.2" fill="#bae6fd" />
          <circle cx="32" cy="58" r="1.2" fill="#bae6fd" />
          <circle cx="68" cy="58" r="1.2" fill="#bae6fd" />
          <circle cx="50" cy="50" r="1.4" fill="#ffffff" />

          {/* Front half of tilted ring */}
          <g transform="rotate(-21 50 50)">
            <path
              d="M 88 50 A 42 10 0 0 1 12 50"
              stroke={`url(#ringGradSmall-${size})`}
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <circle cx="12" cy="50" r="1.5" fill="#ffffff" />
            <circle cx="88" cy="50" r="1.5" fill="#ffffff" />
          </g>
        </svg>
      </div>

      {/* Styled Wordmark NEXORA */}
      {showWordmark && (
        <div className="flex flex-col">
          <div className="flex items-center tracking-wider font-extrabold font-syne uppercase">
            <span className="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
              NEX
            </span>
            <span className="text-cyan-400 drop-shadow-[0_0_14px_rgba(56,189,248,0.7)]">
              OR
            </span>
            <span className="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
              A
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
