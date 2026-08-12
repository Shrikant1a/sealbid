import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Lock, Menu, X, PlusCircle, Gavel, Layers, HelpCircle, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { NetworkStatusBadge } from '../common/LoadingSpinner';
import { WalletButton } from '../wallet/WalletButton';
import { useWallet } from '../../context/WalletContext';
import { useAuctions } from '../../context/AuctionContext';
import { MIDNIGHT_CONFIG } from '../../lib/midnight/config';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { account, setIsWalletModalOpen } = useWallet();
  const { userBids } = useAuctions();

  const currentNetwork = account?.network || MIDNIGHT_CONFIG.networkId;

  const navLinks = [
    { name: 'Auctions', path: '/auctions', icon: Gavel },
    { name: 'Create Auction', path: '/create', icon: PlusCircle },
    { name: 'My Bids', path: '/my-bids', icon: Lock, badge: userBids.length > 0 ? userBids.length : undefined },
    { name: 'My Auctions', path: '/my-auctions', icon: Layers },
    { name: 'How It Works', path: '/how-it-works', icon: HelpCircle },
  ];

  const isActive = (path: string) => {
    if (path === '/auctions' && (location.pathname === '/auctions' || location.pathname.startsWith('/auction/'))) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#060913]/90 backdrop-blur-2xl transition-all duration-300 border-b border-midnight-700/60 shadow-2xl">
      {/* Top subtle laser glow accent line */}
      <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent shadow-[0_0_10px_rgba(6,182,212,0.5)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Automatically Animated Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-3.5 group focus:outline-none"
            onClick={() => setMobileMenuOpen(false)}
          >
            {/* Animated Shield Box with Continuous Rotating Conic Halo & Floating Levitation */}
            <div className="relative logo-floating-box flex items-center justify-center">
              {/* Rotating Conic Light Halo */}
              <div className="logo-spin-halo" />

              {/* Shield Tile Container */}
              <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0c1429] via-[#080d1e] to-[#0a1226] border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all duration-300 group-hover:scale-105">
                <Shield className="w-6 h-6 text-cyan-400 logo-shield-pulse" />
                <Lock className="w-3.5 h-3.5 text-white absolute top-3.5 logo-shield-pulse drop-shadow-[0_0_6px_#06b6d4]" />
              </div>
            </div>

            {/* Brand Title with Continuous Holographic Shimmer & Radar Network Pill */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight font-sans select-none flex items-center">
                  <span className="logo-text-shimmer font-black">Seal</span>
                  <span className="logo-bid-gradient font-black">Bid</span>
                </span>

                {/* Animated ZK Network Pill with Radar Wave Beacon */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-950/80 text-cyan-300 border border-cyan-400/40 uppercase tracking-wider shadow-[0_0_10px_rgba(6,182,212,0.2)] transition-all group-hover:border-cyan-300">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_6px_#22d3ee]"></span>
                  </span>
                  <span>ZK-{currentNetwork}</span>
                </span>
              </div>

              <span className="text-[11px] text-slate-400 font-medium tracking-wide hidden sm:inline group-hover:text-cyan-200/90 transition-colors">
                Private bids. Verifiable results.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links with Glowing Pill Transitions */}
          <nav className="hidden md:flex items-center gap-1.5 bg-midnight-950/60 p-1.5 rounded-2xl border border-midnight-800/80 backdrop-blur-md">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 group ${
                    active
                      ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-200 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-midnight-800/80 hover:border-midnight-700/60 border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                      active ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'
                    }`}
                  />
                  <span>{link.name}</span>

                  {/* Notification Badge with Micro-pulse */}
                  {link.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-cyan-500 text-midnight-950 shadow-[0_0_8px_rgba(6,182,212,0.6)] animate-pulse">
                      {link.badge}
                    </span>
                  )}

                  {/* Active bottom glow accent */}
                  {active && <div className="nav-glow-indicator" />}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions: Network Pill & Wallet */}
          <div className="hidden sm:flex items-center gap-3">
            <NetworkStatusBadge className="hidden lg:inline-flex shadow-sm hover:border-cyan-500/50 transition-colors" />

            {account ? (
              <WalletButton />
            ) : (
              <Button
                variant="primary"
                size="sm"
                className="font-bold shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98] transition-all"
                leftIcon={<Lock className="w-3.5 h-3.5" />}
                rightIcon={<Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />}
                onClick={() => setIsWalletModalOpen(true)}
              >
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Mobile Menu Button with Animated Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            {account && <WalletButton compact />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-300 hover:text-white bg-midnight-900/90 hover:bg-midnight-800 border border-midnight-700/80 focus:outline-none transition-all"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer with Smooth Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-midnight-700/80 bg-[#070b16]/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3 animate-fadeIn shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-midnight-800">
            <NetworkStatusBadge />
            {!account && (
              <Button
                variant="primary"
                size="sm"
                className="w-full ml-3 font-bold shadow-glow-cyan"
                leftIcon={<Lock className="w-3.5 h-3.5" />}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsWalletModalOpen(true);
                }}
              >
                Connect Wallet
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-1.5 pt-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-midnight-800/80 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                  </div>
                  {link.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-black bg-cyan-500 text-midnight-950 shadow-sm">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
