import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ExternalLink, ShieldCheck, Twitter } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { useWallet } from '../../context/WalletContext';

export const Footer: React.FC = () => {
  const { network } = useWallet();

  return (
    <footer className="border-t border-midnight-800/80 bg-[#04060d] text-slate-400 py-12 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="bg-ambient-glow w-96 h-96 bg-cyan-950/20 bottom-0 left-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Socials */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="inline-block focus:outline-none">
              <BrandLogo size="sm" showTagline={true} />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Confidential, zero-knowledge sealed-bid auction infrastructure engineered for the Midnight Network {network}.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <a
                href="https://x.com/SealBids"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-midnight-900 border border-midnight-700 text-xs font-semibold text-slate-200 hover:text-white hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all"
                title="Official SealBid Protocol Product Updates on X"
              >
                <Twitter className="w-3.5 h-3.5 text-cyan-400" />
                <span>@SealBids (Official)</span>
              </a>
              <span className="text-[11px] text-slate-400">
                Architect:{' '}
                <a
                  href="https://x.com/ShriiAher19"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline"
                >
                  Shrikant Aher (@ShriiAher19)
                </a>
              </span>
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

          {/* Col 3: Architecture & Verification */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Verification & Data
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  to="/testers"
                  className="flex items-center gap-1.5 text-cyan-300 hover:text-cyan-200 font-medium transition-colors"
                >
                  <span>📊 User Onboarding Sheet (75+)</span>
                </Link>
              </li>
              <li>
                <a
                  href="/sealbid_user_onboarding_dataset.csv"
                  download="sealbid_user_onboarding_dataset.csv"
                  className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors"
                >
                  <span>💾 Raw Testers Dataset (CSV)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://preview.midnightexplorer.com/contracts/0xa58cea2bc0774c5199569acde83f7acd024e2bedf482205d7ffc13aa334b5827"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors"
                >
                  <span>📜 Preprod Contract Explorer</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-cyan-300 transition-colors">
                  How Sealed Bids Work
                </Link>
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
              Connected to Midnight {network} with Lace DApp Connector. 75 preprod users verified.
            </p>
            <div className="pt-2 border-t border-midnight-800 text-[10px] text-slate-400 flex items-center justify-between">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-cyan-400 font-medium">Compact ZK Circuit Synced</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-midnight-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} SealBid Network. Private Sealed-Bid Auction Protocol on Midnight {network}.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Lock className="w-3 h-3 text-cyan-400" />
              <span>Zero-Knowledge Invariant Guaranteed</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
