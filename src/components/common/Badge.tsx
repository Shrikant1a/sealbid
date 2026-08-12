import React from 'react';
import { cn } from '../../lib/utils';
import { AuctionStatus, BidStatus } from '../../types/auction';
import { Lock, CheckCircle2, Clock, AlertTriangle, Sparkles, Hourglass } from 'lucide-react';

export interface BadgeProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'cyan' | 'emerald' | 'indigo' | 'amber' | 'purple' | 'slate' | 'status' | 'bid_status';
  status?: AuctionStatus;
  endTime?: number;
  bidStatus?: BidStatus;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'slate',
  status,
  endTime,
  bidStatus,
  size = 'md',
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  // If endTime has passed and status is not yet 'completed', override display to 'ended'
  let effectiveStatus = status;
  if (endTime && Date.now() >= endTime && status !== 'completed' && status !== 'cancelled') {
    effectiveStatus = 'ended';
  }

  if (effectiveStatus) {
    switch (effectiveStatus) {
      case 'active':
        return (
          <span className={cn('inline-flex items-center font-medium rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30', sizeStyles[size], className)}>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Active
          </span>
        );
      case 'closing_soon':
        return (
          <span className={cn('inline-flex items-center font-medium rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30', sizeStyles[size], className)}>
            <Clock className="w-3 h-3 text-amber-400" />
            Closing Soon
          </span>
        );
      case 'ended':
      case 'pending_reveal':
        return (
          <span className={cn('inline-flex items-center font-medium rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/40 animate-pulse-subtle', sizeStyles[size], className)}>
            <Hourglass className="w-3 h-3 text-purple-400" />
            Ended (Ready to Settle)
          </span>
        );
      case 'completed':
        return (
          <span className={cn('inline-flex items-center font-medium rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30', sizeStyles[size], className)}>
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Auction Complete
          </span>
        );
      case 'cancelled':
        return (
          <span className={cn('inline-flex items-center font-medium rounded-full bg-red-500/10 text-red-300 border border-red-500/30', sizeStyles[size], className)}>
            <AlertTriangle className="w-3 h-3 text-red-400" />
            Cancelled
          </span>
        );
    }
  }

  if (bidStatus) {
    switch (bidStatus) {
      case 'sealed':
        return (
          <span className={cn('inline-flex items-center font-medium rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30', sizeStyles[size], className)}>
            <Lock className="w-3 h-3 text-cyan-400" />
            🔒 Sealed Private
          </span>
        );
      case 'won':
        return (
          <span className={cn('inline-flex items-center font-medium rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40', sizeStyles[size], className)}>
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            🏆 Winning Bid
          </span>
        );
      case 'lost':
        return (
          <span className={cn('inline-flex items-center font-medium rounded-full bg-slate-700/40 text-slate-300 border border-slate-600/40', sizeStyles[size], className)}>
            <Lock className="w-3 h-3 text-slate-400" />
            🔒 Unrevealed (Lost)
          </span>
        );
      case 'settled':
        return (
          <span className={cn('inline-flex items-center font-medium rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30', sizeStyles[size], className)}>
            <Sparkles className="w-3 h-3 text-indigo-400" />
            Settled
          </span>
        );
      default:
        return null;
    }
  }

  const variantStyles = {
    cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    indigo: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    purple: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    slate: 'bg-slate-800/60 text-slate-300 border-slate-700/50',
    status: '',
    bid_status: '',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border backdrop-blur-md',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
