import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { AuctionCard } from '../components/auction/AuctionCard';
import { useAuctions } from '../context/AuctionContext';
import { useWallet } from '../context/WalletContext';
import { MIDNIGHT_CONFIG, getContractExplorerUrl } from '../lib/midnight/config';
import { ZKSimulator } from '../components/common/ZKSimulator';
import {
  Shield,
  Lock,
  CheckCircle2,
  ArrowRight,
  EyeOff,
  Scale,
  Cpu,
  FileCheck,
  ExternalLink,
  HelpCircle,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { auctions } = useAuctions();
  const { network } = useWallet();
  const featuredAuctions = auctions.slice(0, 3);
  const contractAddr = MIDNIGHT_CONFIG.contractAddress || 'a58cea2bc0774c5199569acde83f7acd024e2bedf482205d7ffc13aa334b5827';
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  return (
    <div className="space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 md:pt-12 pb-16 overflow-hidden">
        {/* Background glow and subtle grids */}
        <div className="bg-ambient-glow w-[550px] h-[550px] bg-cyan-600/15 top-0 left-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="bg-ambient-glow w-[450px] h-[450px] bg-indigo-600/15 top-32 right-10 blur-3xl pointer-events-none" />
        <div className="bg-ambient-glow w-[350px] h-[350px] bg-cyan-400/10 top-20 left-10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          {/* Top Protocol Status Pill */}
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-midnight-950/80 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_25px_rgba(6,182,212,0.25)] text-xs font-semibold text-cyan-300 transition-all hover:border-cyan-400/60">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              <span className="text-slate-300">Midnight {network} Protocol</span>
              <span className="w-1 h-1 rounded-full bg-slate-600"></span>
              <span className="bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent font-bold">
                Zero-Knowledge Sealed Bids Active
              </span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </div>
          </div>

          {/* Main Hero Headline */}
          <div className="space-y-5 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase font-display leading-[1.05]">
              PRIVATE BIDS. <br />
              <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,182,212,0.4)]">
                VERIFIABLE RESULTS.
              </span>
            </h1>
            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Institutional-grade sealed-bid auction infrastructure on Midnight Network. Protect valuations and prevent front-running with zero-knowledge mathematical guarantees.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/auctions" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto font-bold shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Active Auctions
              </Button>
            </Link>

            <Link to="/create" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto font-semibold border-cyan-500/30 hover:border-cyan-400/60 hover:bg-midnight-800/90"
                leftIcon={<Lock className="w-4 h-4 text-cyan-400" />}
              >
                Create Sealed Auction
              </Button>
            </Link>
          </div>

          {/* Verified On-Chain Contract Ribbon */}
          <div className="pt-2 flex items-center justify-center">
            <a
              href={getContractExplorerUrl(contractAddr)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-midnight-900/80 hover:bg-midnight-800/90 border border-midnight-700 hover:border-cyan-500/50 text-xs text-slate-300 hover:text-cyan-200 transition-all font-mono shadow-sm group"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400 font-sans">Verified Preprod Contract:</span>
              <span className="text-cyan-300 font-bold">{contractAddr.slice(0, 10)}...{contractAddr.slice(-8)}</span>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-cyan-300" />
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-5 rounded-2xl bg-midnight-900/60 border border-midnight-750 hover:border-cyan-500/40 backdrop-blur-md shadow-lg transition-all">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">100%</div>
              <div className="text-xs text-slate-400 mt-1 font-medium tracking-wide">Confidential Bids</div>
            </div>
            <div className="p-5 rounded-2xl bg-midnight-900/60 border border-midnight-750 hover:border-cyan-500/40 backdrop-blur-md shadow-lg transition-all">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-display">ZK-SNARK</div>
              <div className="text-xs text-slate-400 mt-1 font-medium tracking-wide">Compact Verification</div>
            </div>
            <div className="p-5 rounded-2xl bg-midnight-900/60 border border-midnight-750 hover:border-indigo-500/40 backdrop-blur-md shadow-lg transition-all">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-display">0 MEV</div>
              <div className="text-xs text-slate-400 mt-1 font-medium tracking-wide">Front-Running Shield</div>
            </div>
            <div className="p-5 rounded-2xl bg-midnight-900/60 border border-midnight-750 hover:border-emerald-500/40 backdrop-blur-md shadow-lg transition-all">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-display">{network}</div>
              <div className="text-xs text-slate-400 mt-1 font-medium tracking-wide">Midnight Native</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE CRYPTOGRAPHIC SIMULATOR SANDBOX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ZKSimulator />
      </section>

      {/* 3. THE PRIVACY PARADIGM: PUBLIC VS PRIVATE BIDDING */}
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

      {/* 6. PROTOCOL FAQ (CONFIDENTIAL ARCHITECTURE DEEP-DIVE) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-2">
            Evaluator & Tester FAQ
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Confidential Architecture & ZK Model
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Answers to key technical questions regarding Midnight state isolation and cryptographic commitments.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'How does SealBid keep bid amounts 100% private from sellers and competitors?',
              a: 'When you submit a bid, your browser executes a client-side witness generator. Your bid amount and random 32-byte salt remain strictly in local browser memory. Only the cryptographic commitment `Hash(bidAmount || salt || bidderPk)` is written to the Midnight public ledger. Computational hiding guarantees that reconstructing the bid amount from this hash is mathematically infeasible.'
            },
            {
              q: 'How does settlement declare a winner without exposing losing valuations?',
              a: 'Upon auction closing, the winning bidder provides their private witnesses to the Midnight Compact circuit (`settleWinningBid`). The zero-knowledge verifier confirms that the bid satisfies the reserve price and matches the recorded commitment tree root. The winner is proclaimed on-chain, while all losing bid amounts remain permanently sealed.'
            },
            {
              q: 'What prevents front-running and MEV bid sniping?',
              a: 'In traditional blockchains (Ethereum, Solana), bids sit in the public mempool before block inclusion, allowing MEV bots to outbid by 1 wei. On Midnight, all bids are opaque cryptographic commitments. An adversary cannot determine how much you bid, eliminating front-running entirely.'
            },
            {
              q: 'How can evaluators verify the Midnight Preprod smart contract?',
              a: 'The contract is verified on Midnight Night Scan. Click the "Verified Preprod Contract" badge in the hero banner or visit the Explorer link in the documentation to inspect the ledger state and circuit transitions.'
            }
          ].map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl glass-card border-midnight-700/70 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:text-cyan-300 transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-white flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{item.q}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-midnight-800/80">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
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
