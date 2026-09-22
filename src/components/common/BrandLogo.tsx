import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  networkBadge?: string;
  animate?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = false,
  networkBadge,
  animate = true,
  className = '',
}) => {
  const sizeMap = {
    sm: {
      icon: 'w-7 h-7',
      text: 'text-lg',
      badge: 'text-[9px] px-1.5 py-0.5',
      tagline: 'text-[9px]',
    },
    md: {
      icon: 'w-9 h-9',
      text: 'text-xl sm:text-2xl',
      badge: 'text-[10px] px-2 py-0.5',
      tagline: 'text-[10px]',
    },
    lg: {
      icon: 'w-11 h-11',
      text: 'text-2xl sm:text-3xl',
      badge: 'text-xs px-2.5 py-1',
      tagline: 'text-xs',
    },
    xl: {
      icon: 'w-14 h-14',
      text: 'text-3xl sm:text-4xl',
      badge: 'text-xs px-3 py-1',
      tagline: 'text-sm',
    },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none group ${className}`}>
      {/* High-Precision Isometric Cryptographic Emblem */}
      <div className={`relative flex items-center justify-center flex-shrink-0 ${currentSize.icon}`}>
        {/* Subtle Ambient Radial Glow */}
        {animate && (
          <div
            className="absolute -inset-1 rounded-full opacity-60 blur-md transition-all duration-500 group-hover:opacity-100 group-hover:scale-110"
            style={{
              background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, rgba(99,102,241,0.2) 60%, transparent 80%)',
            }}
          />
        )}

        {/* Vector SVG Emblem */}
        <svg
          viewBox="0 0 120 120"
          className="relative w-full h-full filter drop-shadow-[0_2px_10px_rgba(6,182,212,0.35)] transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`blRim-${size}`} x1="16" y1="10" x2="104" y2="110" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="35%" stopColor="#06b6d4" />
              <stop offset="70%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>

            <linearGradient id={`blCore-${size}`} x1="20" y1="15" x2="80" y2="95" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="50%" stopColor="#080e1a" />
              <stop offset="100%" stopColor="#030712" />
            </linearGradient>
          </defs>

          {/* Outer Isometric Shield / Vault */}
          <path
            d="M60 8 L104 28 V76 L60 112 L16 76 V28 Z"
            fill={`url(#blCore-${size})`}
            stroke={`url(#blRim-${size})`}
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Inner Facet */}
          <path
            d="M60 18 L94 34 V70 L60 98 L26 70 V34 Z"
            fill="#060b16"
            stroke="#38bdf8"
            strokeOpacity="0.4"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeDasharray="80 3"
          />

          {/* Gavel Head & Key Shackle */}
          <path
            d="M42 36 L78 36 L84 46 L36 46 Z"
            fill={`url(#blRim-${size})`}
            stroke="#e0f2fe"
            strokeWidth="1"
          />
          <path d="M57 46 V62 H63 V46 Z" fill={`url(#blRim-${size})`} />

          {/* Central Vault Octagon Core */}
          <polygon
            points="60,54 75,62 75,78 60,86 45,78 45,62"
            fill="#0c1527"
            stroke={`url(#blRim-${size})`}
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Glowing ZK Commitment Eye / Keyhole */}
          <circle cx="60" cy="69" r="4.8" fill="none" stroke="#22d3ee" strokeWidth="1.8" />
          <circle cx="60" cy="69" r="2.2" fill="#38bdf8" />
          <path d="M60 74 V80" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />

          {/* Left & Right Cryptographic Nodes */}
          <circle cx="30" cy="52" r="2.5" fill="#22d3ee" />
          <circle cx="90" cy="52" r="2.5" fill="#c084fc" />

          {/* Ascending Value Trace */}
          <line x1="60" y1="86" x2="60" y2="96" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
          <circle cx="60" cy="98" r="3" fill="#22d3ee" />
        </svg>
      </div>

      {/* Brand Typography & Badges */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`font-black tracking-tight font-display ${currentSize.text} leading-none`}>
              <span className="text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.25)]">Seal</span>
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(6,182,212,0.4)]">
                Bid
              </span>
            </span>

            {/* Optional ZK Network Badge */}
            {networkBadge && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-cyan-950/70 text-cyan-300 border border-cyan-400/40 uppercase tracking-wider whitespace-nowrap shadow-[0_0_12px_rgba(6,182,212,0.2)] transition-all group-hover:border-cyan-300/80 ${currentSize.badge}`}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400"></span>
                </span>
                <span>{networkBadge}</span>
              </span>
            )}
          </div>

          {showTagline && (
            <span className={`text-slate-400 font-medium tracking-wide mt-1 ${currentSize.tagline}`}>
              Confidential Auction Protocol
            </span>
          )}
        </div>
      )}
    </div>
  );
};
