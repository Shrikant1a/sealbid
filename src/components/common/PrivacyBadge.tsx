import React from 'react';
import { cn } from '../../lib/utils';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export type PrivacyBadgeType = 
  | 'private-bid' 
  | 'bid-confidential' 
  | 'winner-verified' 
  | 'tx-confirmed'
  | 'zero-knowledge';

interface PrivacyBadgeProps {
  type: PrivacyBadgeType;
  className?: string;
  size?: 'sm' | 'md';
}

export const PrivacyBadge: React.FC<PrivacyBadgeProps> = ({
  type,
  className,
  size = 'md',
}) => {
  const { network } = useWallet();

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  switch (type) {
    case 'private-bid':
      return (
        <span
          title="Bid amounts remain confidential. Only a cryptographic commitment is posted on-chain."
          className={cn(
            'inline-flex items-center font-semibold rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 shadow-sm backdrop-blur-md',
            sizeStyles[size],
            className
          )}
        >
          <Lock className="w-3 h-3 text-cyan-400 shrink-0" />
          <span>🔒 Private Bid</span>
        </span>
      );

    case 'bid-confidential':
      return (
        <span
          title="This bid is protected by zero-knowledge cryptography. Nobody except you can see the amount."
          className={cn(
            'inline-flex items-center font-semibold rounded-full bg-indigo-950/70 text-indigo-300 border border-indigo-500/40 shadow-sm backdrop-blur-md',
            sizeStyles[size],
            className
          )}
        >
          <Lock className="w-3 h-3 text-indigo-400 shrink-0" />
          <span>🔒 Bid Confidential</span>
        </span>
      );

    case 'winner-verified':
      return (
        <span
          title="The winning bid was proven cryptographically by Midnight Compact circuits without revealing losing bids."
          className={cn(
            'inline-flex items-center font-semibold rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 shadow-sm backdrop-blur-md',
            sizeStyles[size],
            className
          )}
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
          <span>✓ Winner Verified</span>
        </span>
      );

    case 'tx-confirmed':
      return (
        <span
          title={`Transaction verified and finalized on Midnight ${network} network.`}
          className={cn(
            'inline-flex items-center font-semibold rounded-full bg-teal-950/70 text-teal-300 border border-teal-500/40 shadow-sm backdrop-blur-md',
            sizeStyles[size],
            className
          )}
        >
          <ShieldCheck className="w-3 h-3 text-teal-400 shrink-0" />
          <span>✓ Transaction Confirmed</span>
        </span>
      );

    case 'zero-knowledge':
      return (
        <span
          title="Verified via Midnight Compact Zero-Knowledge Proofs"
          className={cn(
            'inline-flex items-center font-semibold rounded-full bg-slate-900/80 text-cyan-200 border border-cyan-500/30 backdrop-blur-md',
            sizeStyles[size],
            className
          )}
        >
          <ShieldCheck className="w-3 h-3 text-cyan-400 shrink-0" />
          <span>ZK-Protected</span>
        </span>
      );

    default:
      return null;
  }
};
