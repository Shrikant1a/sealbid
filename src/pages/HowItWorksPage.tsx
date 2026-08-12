import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useWallet } from '../context/WalletContext';
import {
  Shield,
  Lock,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileCode,
  EyeOff,
  Scale
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { network } = useWallet();

  const steps = [
    {
      step: '01',
      title: 'Connect Wallet',
      subtitle: 'Shielded Keypair Initialization',
      desc: `Connect your Midnight Lace wallet. Your browser establishes private cryptographic keys used to generate zero-knowledge witnesses on Midnight ${network}.`,
      icon: Shield,
      tag: 'Lace DApp Connector',
      color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
    },
    {
      step: '02',
      title: 'Join an Auction',
      subtitle: 'Confidential Marketplace Discovery',
      desc: 'Select an active sealed-bid auction for digital assets, sovereign compute clusters, or DeFi liquidity tranches. Inspect the reserve price and duration.',
      icon: Layers,
      tag: 'Compact Contract',
      color: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    },
    {
      step: '03',
      title: 'Submit a Private Bid',
      subtitle: 'Zero-Knowledge Commitment Creation',
      desc: 'Enter your valuation. Your client generates a random cryptographic salt and constructs a zero-knowledge commitment: `Hash(bid || salt || pk)`. Only the hash is posted to Midnight; your numeric amount never touches the network in plaintext.',
      icon: Lock,
      tag: 'Zero-Knowledge Witness',
      color: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10',
    },
    {
      step: '04',
      title: 'Auction Closes',
      subtitle: 'State Transition & Commitment Lock',
      desc: 'When the auction duration expires, the Compact smart contract locks new submissions. The on-chain Merkle tree of commitments becomes frozen for settlement.',
      icon: Scale,
      tag: 'Consensus Finality',
      color: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
    },
    {
      step: '05',
      title: 'Winner is Verified',
      subtitle: 'Compact Circuit Highest-Bid Prover',
      desc: 'The winner is proven mathematically via the Midnight Compact circuit. The smart contract validates that the winner submitted the highest commitment among all participants.',
      icon: CheckCircle2,
      tag: 'ZK-SNARK Verification',
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    },
    {
      step: '06',
      title: 'Private Bids Remain Confidential',
      subtitle: 'Permanent Privacy Invariant',
      desc: 'Losing bidders never disclose their bid amounts or private salts. Their bids stay sealed forever, completely protecting their private financial intelligence and market strategies.',
      icon: ShieldCheck,
      tag: 'Zero-Leakage Invariant',
      color: 'border-teal-500/40 text-teal-400 bg-teal-500/10',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-semibold text-cyan-300">
          <Shield className="w-3.5 h-3.5" />
          Midnight Cryptographic Architecture
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase font-sans">
          How SealBid Works
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          A step-by-step breakdown of how zero-knowledge proofs and Midnight Compact smart contracts enable confidential sealed-bid auctions with verifiable settlements on Midnight {network}.
        </p>
      </div>

      {/* 6 Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.step}
              variant="glass"
              hoverEffect
              className="p-6 border-midnight-700/70 space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-extrabold text-slate-700 font-mono">
                    {item.step}
                  </span>
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-widest block mb-1">
                  {item.subtitle}
                </span>

                <h3 className="text-lg font-bold text-white mb-2">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-midnight-800">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-midnight-950 text-slate-400 border border-midnight-800">
                  {item.tag}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Architecture & Compact Smart Contract Deep-Dive */}
      <div className="p-8 sm:p-10 rounded-3xl bg-midnight-900/90 border border-midnight-700/80 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Midnight Compact Smart Contract Model
            </h2>
            <p className="text-xs text-slate-400">
              Separation of Private Witness Computation and Public Ledger Validation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-5 rounded-2xl bg-midnight-950 border border-midnight-800 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold">
              <EyeOff className="w-4 h-4" />
              <span>Private Domain (Browser / Client Witness)</span>
            </div>
            <ul className="space-y-2 text-slate-300 leading-relaxed">
              <li>• Numeric Bid Amount in tDU</li>
              <li>• Cryptographic Random Salt (32-byte secret witness)</li>
              <li>• Shielded Spending Secret Keys</li>
              <li>• Local Groth16 / Halo2 Witness Construction</li>
            </ul>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-midnight-850">
              Never shared over network. Processed strictly inside client environment.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-midnight-950 border border-midnight-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <FileCode className="w-4 h-4" />
              <span>Public Domain (Midnight {network} Consensus)</span>
            </div>
            <ul className="space-y-2 text-slate-300 leading-relaxed">
              <li>• Auction Contract State (Start, End, Reserve)</li>
              <li>• Merkle Tree of Blinded Commitment Hashes</li>
              <li>• Zero-Knowledge Proof Verification Verification Key (VK)</li>
              <li>• Verified Winner Settlement State Transition</li>
            </ul>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-midnight-850">
              Globally auditable by all nodes on Midnight {network} network.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-white">Experience Confidential Auctions Today</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Explore active auctions or deploy your own private sealed-bid auction contract.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <Link to="/auctions">
            <Button variant="primary" size="lg" className="font-bold shadow-glow-cyan" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore Auctions
            </Button>
          </Link>
          <Link to="/create">
            <Button variant="secondary" size="lg">
              Create Auction
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
