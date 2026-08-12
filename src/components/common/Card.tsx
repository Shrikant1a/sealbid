import React, { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'glass' | 'midnight' | 'subtle' | 'glow';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'glass',
  hoverEffect = false,
  ...props
}) => {
  const variantStyles = {
    glass: 'glass-card',
    midnight: 'bg-midnight-900/90 border border-midnight-700/50 shadow-xl',
    subtle: 'bg-midnight-900/40 border border-midnight-800/40',
    glow: 'glass-card border-cyan-500/30 shadow-glow-cyan',
  };

  return (
    <div
      className={cn(
        'rounded-2xl p-5 md:p-6 transition-all duration-300 relative overflow-hidden',
        variantStyles[variant],
        hoverEffect && 'hover:border-cyan-500/40 hover:shadow-glow-cyan hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
