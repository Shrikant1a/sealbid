import React from 'react';
import { cn } from '../../lib/utils';
import { ShieldAlert, LucideIcon } from 'lucide-react';
import { Button } from './Button';
import { useWallet } from '../../context/WalletContext';

export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}> = ({ size = 'md', text, className }) => {
  const sizeMap = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center p-6 gap-3', className)}>
      <div
        className={cn(
          'rounded-full border-cyan-500/20 border-t-cyan-400 animate-spin',
          sizeMap[size]
        )}
      />
      {text && <p className="text-xs font-medium text-slate-400 animate-pulse">{text}</p>}
    </div>
  );
};

export const EmptyState: React.FC<{
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}> = ({
  icon: Icon = ShieldAlert,
  title,
  description,
  actionText,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-2xl bg-midnight-900/40 border border-midnight-800/60 max-w-md mx-auto',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-midnight-800/80 border border-midnight-700 flex items-center justify-center mb-4 text-cyan-400 shadow-inner">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-white mb-1.5">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed mb-5 max-w-xs">{description}</p>
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export const NetworkStatusBadge: React.FC<{ className?: string; networkOverride?: string }> = ({
  className,
  networkOverride,
}) => {
  const { network } = useWallet();
  const currentNetwork = networkOverride || network || 'Preview';

  return (
    <div
      title={`Connected to Midnight ${currentNetwork}`}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-midnight-900/90 border border-midnight-700/80 text-[11px] font-mono text-slate-300 backdrop-blur-md',
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span className="font-semibold text-slate-200">Midnight {currentNetwork}</span>
    </div>
  );
};
