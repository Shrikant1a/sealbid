import React, { useState, useEffect } from 'react';
import { getTimeRemaining, cn } from '../../lib/utils';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  endTime: number;
  className?: string;
  variant?: 'pill' | 'boxes' | 'minimal';
  showIcon?: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endTime,
  className,
  variant = 'pill',
  showIcon = true,
}) => {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(endTime));

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getTimeRemaining(endTime);
      setTimeLeft(remaining);
      if (remaining.isExpired) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  if (timeLeft.isExpired) {
    return (
      <div className={cn('inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400', className)}>
        {showIcon && <Clock className="w-3.5 h-3.5" />}
        <span>Auction Ended</span>
      </div>
    );
  }

  if (variant === 'boxes') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {timeLeft.days > 0 && (
          <div className="flex flex-col items-center bg-midnight-900/80 border border-midnight-700/60 rounded-xl px-3 py-1.5 min-w-[50px]">
            <span className="text-lg font-bold text-cyan-300 font-mono">{timeLeft.days}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Days</span>
          </div>
        )}
        <div className="flex flex-col items-center bg-midnight-900/80 border border-midnight-700/60 rounded-xl px-3 py-1.5 min-w-[50px]">
          <span className="text-lg font-bold text-cyan-300 font-mono">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Hours</span>
        </div>
        <div className="flex flex-col items-center bg-midnight-900/80 border border-midnight-700/60 rounded-xl px-3 py-1.5 min-w-[50px]">
          <span className="text-lg font-bold text-cyan-300 font-mono">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Mins</span>
        </div>
        <div className="flex flex-col items-center bg-midnight-900/80 border border-midnight-700/60 rounded-xl px-3 py-1.5 min-w-[50px]">
          <span className="text-lg font-bold text-cyan-400 font-mono">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Secs</span>
        </div>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <span className={cn('font-mono text-xs font-medium text-slate-300', className)}>
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
      </span>
    );
  }

  // Pill variant (default)
  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 4;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium backdrop-blur-md border',
        isUrgent
          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 animate-pulse-subtle'
          : 'bg-midnight-800/80 text-cyan-300 border-midnight-700/60',
        className
      )}
    >
      {showIcon && <Clock className={cn('w-3.5 h-3.5', isUrgent ? 'text-amber-400' : 'text-cyan-400')} />}
      <span>
        {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
        {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
      </span>
    </div>
  );
};
