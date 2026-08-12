import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { AuctionCard } from '../components/auction/AuctionCard';
import { useAuctions } from '../context/AuctionContext';
import { useWallet } from '../context/WalletContext';
import {
  Shield,
  Lock,
  CheckCircle2,
  ArrowRight,
  EyeOff,
  Scale,
  Cpu,
  FileCheck
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { auctions } = useAuctions();
  const { network } = useWallet();
  const featuredAuctions = auctions.slice(0, 3);

  return (
    <div className="space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 md:pt-20 pb-16 overflow-hidden">
        {/* Background glow and subtle grids */}
        <div className="bg-ambient-glow w-[500px] h-[500px] bg-cyan-600/15 top-10 left-1/2 -translate-x-1/2" />
        <div className="bg-ambient-glow w-[400px] h-[400px] bg-indigo-600/15 top-40 right-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 backdrop-blur-md animate-fadeIn">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-300">
              Midnight Network {network} Sealed-Bid Protocol
            </span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
          </div>

          {/* Main Title */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase font-sans leading-[1.08]">
              PRIVATE BIDS. <br />
              <span className="gradient-text-cyan">VERIFIABLE RESULTS.</span>
            </h1>
            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Run auctions where bid amounts stay private while the final result remains verifiable.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/auctions" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto font-bold shadow-glow-cyan"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Auctions
              </Button>
            </Link>

            <Link to="/create" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
                leftIcon={<Lock className="w-4 h-4 text-cyan-400" />}
              >
                Create Auction
              </Button>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-midnight-900/50 border border-midnight-750/70 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">100%</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Confidential Bids</div>
            </div>
            <div className="p-4 rounded-2xl bg-midnight-900/50 border border-midnight-750/70 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">ZK-SNARK</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Compact Verification</div>
            </div>
            <div className="p-4 rounded-2xl bg-midnight-900/50 border border-midnight-750/70 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono">0 MEV</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Front-Running Shield</div>
            </div>
            <div className="p-4 rounded-2xl bg-midnight-900/50 border border-midnight-750/70 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">{network}</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Midnight Native</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PRIVACY PARADIGM: PUBLIC VS PRIVATE BIDDING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-b from-[#0b1226] to-[#070b18] border border-midnight-700/60 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-2">
              The Confidential Advantage
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Why Traditional Blockchain Auctions Fail Bidders
            </h2>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
              Standard public ledgers leak bid amounts in real-time, exposing participants to front-running, bid sniping, and strategic price manipulation. SealBid leverages Midnight’s Zero-Knowledge Compact circuits to seal bids permanently until settlement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Flawed Public Auctions */}
            <div className="p-6 rounded-2xl bg-red-950/10 border border-red-500/20 space-y-4">
              <div className="flex items-center gap-2.5 text-red-400">
                <EyeOff className="w-5 h-5" />
                <h3 className="text-base font-bold">Public Blockchain Auctions</h3>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Bids are visible to competitors, creating predatory bidding wars</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>MEV bots extract value via last-millisecond front-running</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Losing bidders' valuations and financial positions are exposed permanently</span>
                </li>
              </ul>
            </div>

            {/* SealBid Privacy Guarantee */}
            <div className="p-6 rounded-2xl bg-cyan-950/20 border border-cyan-500/40 space-y-4 shadow-glow-cyan">
              <div className="flex items-center gap-2.5 text-cyan-300">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold">SealBid Confidential Auctions</h3>
              </div>
              <ul className="space-y-3 text-xs text-slate-200">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Zero Leakage:</strong> Individual bid amounts remain completely hidden inside client ZK witnesses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Fair Price Discovery:</strong> Participants bid their true valuation without psychological gaming</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Verifiable Settlement:</strong> Compact circuit proves the winning bid without revealing losing amounts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (6 KEY STEPS SNAPSHOT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-2">
            Protocol Mechanics
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            How Private Sealed Bidding Works
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Seamless zero-knowledge execution powered by Midnight Compact smart contracts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Connect Wallet',
              desc: `Connect your Midnight Lace wallet to establish your shielded cryptographic keys on Midnight ${network}.`,
              icon: Shield,
            },
            {
              step: '02',
              title: 'Submit Private Bid',
              desc: 'Your client compiles a ZK commitment. The bid amount is sealed locally; only the hash is published.',
              icon: Lock,
            },
            {
              step: '03',
              title: 'Compact Verification',
              desc: 'Upon auction closing, the Compact circuit verifies the highest bidder with mathematical finality while keeping other bids private.',
              icon: CheckCircle2,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="p-6 rounded-2xl glass-card border-midnight-700/60 hover:border-cyan-500/40 transition-all space-y-3 relative overflow-hidden group"
              >
                <div className="text-3xl font-extrabold text-slate-800 font-mono group-hover:text-cyan-500/20 transition-colors">
                  {item.step}
                </div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group"
          >
            <span>Read full 6-step cryptographic architecture</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 4. FEATURED AUCTIONS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-1">
              Live Auctions
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Featured Confidential Auctions
            </h2>
          </div>
          <Link to="/auctions">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              View All Marketplace ({auctions.length})
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredAuctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      </section>

      {/* 5. KEY PROTOCOL BENEFITS (FEATURE CARDS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-2">
            Core Innovations
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Engineered for High-Stakes Confidential DeFi
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-panel space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Collusion & Sniping Resistant</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Without public bid amounts, adversaries cannot coordinate price undercutting or snipe auctions at the final block.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Compact Smart Contracts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Built on Midnight’s Compact programming language, combining private computation with public consensus validation.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Permanent Privacy Preservation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Even after the auction concludes and the winner is verified, losing bid values are never revealed or stored on-chain.
            </p>
          </div>
        </div>
      </section>

      {/* 6. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 md:p-14 bg-gradient-to-r from-cyan-950/50 via-[#0b1020] to-indigo-950/50 border border-cyan-500/40 shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="bg-ambient-glow w-80 h-80 bg-cyan-500/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-300">
            <Shield className="w-3.5 h-3.5" />
            Midnight {network} Ready
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase max-w-2xl mx-auto">
            Ready to Run Confidential Auctions?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Experience true sealed-bid privacy with zero-knowledge verification on the Midnight Network.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/auctions">
              <Button variant="primary" size="lg" className="w-full sm:w-auto font-bold shadow-glow-cyan">
                Explore All Auctions
              </Button>
            </Link>
            <Link to="/create">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Create Private Auction
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
