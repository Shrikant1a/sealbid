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
    sm: { icon: 'w-8 h-8', text: 'text-lg', badge: 'text-[9px] px-1.5 py-0.5', tagline: 'text-[9px]' },
    md: { icon: 'w-10 h-10', text: 'text-xl sm:text-2xl', badge: 'text-[10px] px-2 py-0.5', tagline: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl sm:text-3xl', badge: 'text-xs px-2.5 py-1', tagline: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-3xl sm:text-4xl', badge: 'text-xs px-3 py-1', tagline: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none group ${className}`}>
      {/* Bespoke Vector Cryptographic Emblem */}
      <div className={`relative flex items-center justify-center flex-shrink-0 ${currentSize.icon}`}>
        {/* Ambient Rotating Conic Halo */}
        {animate && (
          <div
            className="absolute -inset-1 rounded-2xl opacity-75 blur-sm transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: 'conic-gradient(from 0deg, #22d3ee, #6366f1, #a855f7, #22d3ee)',
              animation: 'spin 8s linear infinite',
            }}
          />
        )}

        {/* Outer Shield Container */}
        <div className="relative w-full h-full rounded-xl bg-[#060913] border border-cyan-400/50 p-1 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-transform duration-300 group-hover:scale-105">
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id={`blRim-${size}`} x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
              <linearGradient id={`blCore-${size}`} x1="30" y1="30" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
            </defs>

            {/* Shield Body */}
            <path
              d="M60 12 L98 28 C98 64 82 92 60 106 C38 92 22 64 22 28 Z"
              fill="#0a1226"
              stroke={`url(#blRim-${size})`}
              strokeWidth="5"
              strokeLinejoin="round"
            />

            {/* Inner dashed circuit line */}
            <path
              d="M60 22 L88 34 C88 62 76 83 60 95 C44 83 32 62 32 34 Z"
              fill="#060913"
              stroke="#06b6d4"
              strokeOpacity="0.4"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />

            {/* Circuit traces */}
            <path d="M38 48 H50" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            <circle cx="38" cy="48" r="3" fill="#22d3ee" />
            <path d="M82 48 H70" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            <circle cx="82" cy="48" r="3" fill="#c084fc" />

            {/* Lock Arch */}
            <path
              d="M50 54 V44 C50 38.5 54.5 34 60 34 C65.5 34 70 38.5 70 44 V54"
              fill="none"
              stroke={`url(#blRim-${size})`}
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Lock Body */}
            <rect
              x="45"
              y="52"
              width="30"
              height="26"
              rx="6"
              fill={`url(#blCore-${size})`}
              stroke="#e0f2fe"
              strokeWidth="2"
            />

            {/* Center ZK Aperture */}
            <circle cx="60" cy="63" r="3.5" fill="#030712" />
            <path d="M58.5 64.5 L57 71 H63 L61.5 64.5 Z" fill="#030712" />
            <circle cx="60" cy="63" r="1.5" fill="#38bdf8" />

            {/* Bottom Node */}
            <circle cx="60" cy="87" r="3.5" fill="#22d3ee" />
          </svg>
        </div>
      </div>

      {/* Brand Typography & Badges */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`font-black tracking-tight font-display ${currentSize.text} leading-none`}>
              <span className="text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]">Seal</span>
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                Bid
              </span>
            </span>

            {/* Optional ZK Network Badge */}
            {networkBadge && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-400/40 uppercase tracking-wider whitespace-nowrap shadow-[0_0_10px_rgba(6,182,212,0.2)] transition-all group-hover:border-cyan-300/80 ${currentSize.badge}`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
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
