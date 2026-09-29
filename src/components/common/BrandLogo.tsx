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

        {/* Bespoke Geometric Vector Emblem */}
        <svg
          viewBox="0 0 120 120"
          className="relative w-full h-full filter drop-shadow-[0_2px_10px_rgba(0,229,255,0.35)] transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id={`sbAmb-${size}`} cx="60" cy="60" r="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#4F46E5" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#050814" stopOpacity="0" />
            </radialGradient>

            <linearGradient id={`sbRim-${size}`} x1="16" y1="16" x2="104" y2="104" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>

            <linearGradient id={`sbRibbonS-${size}`} x1="30" y1="28" x2="75" y2="70" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="50%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>

            <linearGradient id={`sbRibbonB-${size}`} x1="50" y1="50" x2="90" y2="92" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>

            <radialGradient id={`sbCore-${size}`} cx="60" cy="60" r="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0B132B" />
              <stop offset="100%" stopColor="#050814" />
            </radialGradient>
          </defs>

          {/* Ambient Glow */}
          <circle cx="60" cy="60" r="54" fill={`url(#sbAmb-${size})`} />

          {/* Outer Cryptographic Vault Disk */}
          <circle
            cx="60"
            cy="60"
            r="48"
            fill={`url(#sbCore-${size})`}
            stroke={`url(#sbRim-${size})`}
            strokeWidth="3"
          />

          {/* Precision Security Registration Ticks */}
          <line x1="60" y1="8" x2="60" y2="15" stroke="#00E5FF" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="60" y1="105" x2="60" y2="112" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="8" y1="60" x2="15" y2="60" stroke="#00E5FF" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="105" y1="60" x2="112" y2="60" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" />

          {/* Inner Concentric Track */}
          <circle
            cx="60"
            cy="60"
            r="41"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            strokeOpacity="0.4"
          />

          {/* Interlocking Monogram ('S' & 'B') */}
          <path
            d="M42 46 C42 36 50 28 60 28 C70 28 78 36 78 46 C78 52 74 56 68 58 L52 62 C46 64 42 68 42 74 C42 84 50 92 60 92 C70 92 78 84 78 74"
            fill="none"
            stroke={`url(#sbRibbonS-${size})`}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M52 38 V82 C52 82 76 84 76 70 C76 60 66 58 60 58 C68 58 74 54 74 44 C74 34 52 36 52 38 Z"
            fill="none"
            stroke={`url(#sbRibbonB-${size})`}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.9"
          />

          {/* Center ZK Privacy Vault Aperture */}
          <circle cx="60" cy="60" r="6" fill="#050814" stroke="#00E5FF" strokeWidth="2" />
          <circle cx="60" cy="60" r="2.5" fill="#00E5FF" />
          <path d="M60 65 V70" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" />
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
