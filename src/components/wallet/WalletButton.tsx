import React, { useState, useRef, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { formatAddress, formatTDU } from '../../lib/utils';
import { Shield, ChevronDown, Copy, LogOut, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const WalletButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { account, networkConfig, disconnect, expectedNetwork, isWrongNetwork } = useWallet();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!account) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('info', 'Copied to Clipboard', `${label} copied.`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl transition-all duration-200 shadow-md focus:outline-none group hover:shadow-lg ${
          isWrongNetwork 
            ? 'bg-red-900/40 hover:bg-red-900/60 border border-red-500/80 text-red-100 hover:border-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.25)]' 
            : 'bg-midnight-900/90 hover:bg-midnight-800 border border-midnight-700/80 text-slate-100 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]'
        }`}
      >
        <div className={`w-6 h-6 rounded-lg border flex items-center justify-center group-hover:scale-105 transition-transform ${
          isWrongNetwork 
            ? 'bg-red-500/20 border-red-500/40 text-red-400' 
            : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
        }`}>
          <Shield className="w-3.5 h-3.5" />
        </div>

        {!compact && (
          <div className="flex flex-col text-left">
            <span className="text-xs font-mono font-medium leading-tight flex items-center gap-1">
              {isWrongNetwork ? 'Wrong Network' : formatAddress(account.address, 6, 4)}
            </span>
            <span className={`text-[10px] font-bold leading-tight ${isWrongNetwork ? 'text-red-400' : 'text-cyan-400'}`}>
              {isWrongNetwork ? `Switch to ${expectedNetwork}` : formatTDU(account.balanceTDU)}
            </span>
          </div>
        )}

        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-400' : 'text-slate-400'}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0b1020]/95 backdrop-blur-2xl border border-midnight-600/80 shadow-2xl p-4 z-50 animate-fadeIn">
          {/* Header Info */}
          <div className="pb-3 mb-3 border-b border-midnight-750">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-300">Connected Account</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {account.isLaceConnected ? 'Midnight Lace' : 'Preview Key'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-midnight-950 border border-midnight-800">
              <span className="text-xs font-mono text-cyan-300">
                {formatAddress(account.address, 10, 6)}
              </span>
              <button
                onClick={() => handleCopy(account.address, 'Public Address')}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-midnight-800 transition-colors"
                title="Copy address"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Shielded Address & Balance */}
          <div className="space-y-2 mb-3 text-xs">
            <div className="flex justify-between items-center text-slate-400">
              <span>Balance:</span>
              <span className="font-semibold text-white font-mono">{formatTDU(account.balanceTDU)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Network:</span>
              <span className="text-cyan-300 font-semibold">{account.network}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Shielded State:</span>
              <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> Ready
              </span>
            </div>
          </div>

          {/* Links and Actions */}
          <div className="pt-2 border-t border-midnight-750 space-y-1.5">
            <a
              href={`${networkConfig.explorer}/address/${account.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full px-2.5 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-midnight-800 transition-colors group"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                View in Midnight Explorer
              </span>
            </a>

            <button
              onClick={() => {
                setIsOpen(false);
                disconnect();
              }}
              className="flex items-center gap-2 w-full px-2.5 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Disconnect Wallet</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
