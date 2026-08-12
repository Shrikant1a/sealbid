import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, ExternalLink, ShieldCheck, Terminal, Twitter } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export const Footer: React.FC = () => {
  const { network, networkConfig } = useWallet();

  return (
    <footer className="border-t border-midnight-800/80 bg-[#04060d] text-slate-400 py-12 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="bg-ambient-glow w-96 h-96 bg-cyan-950/20 bottom-0 left-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Socials */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-midnight-800 border border-cyan-500/30">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Seal<span className="text-cyan-400">Bid</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Confidential, zero-knowledge sealed-bid auction infrastructure engineered for the Midnight Network {network}.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://x.com/ShriiAher19"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-midnight-900 border border-midnight-700 text-xs font-semibold text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all"
              >
                <Twitter className="w-3.5 h-3.5 text-cyan-400" />
                <span>@ShriiAher19</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/auctions" className="hover:text-cyan-300 transition-colors">
                  Explore Auctions
                </Link>
              </li>
              <li>
                <Link to="/create" className="hover:text-cyan-300 transition-colors">
                  Create Sealed Auction
                </Link>
              </li>
              <li>
                <Link to="/my-bids" className="hover:text-cyan-300 transition-colors">
                  Confidential Bid Receipts
                </Link>
              </li>
              <li>
                <Link to="/my-auctions" className="hover:text-cyan-300 transition-colors">
                  Auction Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Architecture & Privacy */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Midnight Architecture
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/how-it-works" className="hover:text-cyan-300 transition-colors">
                  How Sealed Bids Work
                </Link>
              </li>
              <li>
                <a
                  href="https://docs.midnight.network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors"
                >
                  <span>Compact Language Docs</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href={networkConfig.explorer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors"
                >
                  <span>Midnight {network} Explorer</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                  <Terminal className="w-3 h-3 text-cyan-400" />
                  <span>Proof Server: Port 6300</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Network Status Box */}
          <div className="rounded-xl bg-midnight-900/60 border border-midnight-700/50 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">Active Network</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                {network}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Connected to Midnight {network} with Lace DApp Connector.
            </p>
            <div className="pt-2 border-t border-midnight-800 text-[10px] text-slate-400 flex items-center justify-between">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-cyan-400 font-medium">Compact ZK Circuit Ready</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-midnight-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} SealBid. Private Sealed-Bid Auction DApp on Midnight {network}.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Lock className="w-3 h-3 text-cyan-400" />
              <span>Zero Knowledge Invariant Guaranteed</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
