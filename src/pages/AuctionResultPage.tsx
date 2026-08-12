import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuctions } from '../context/AuctionContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { VerificationModal } from '../components/auction/VerificationModal';
import { formatTDU, formatAddress } from '../lib/utils';
import {
  CheckCircle2,
  Lock,
  ShieldCheck,
  Award,
  ArrowRight,
  Cpu
} from 'lucide-react';

export const AuctionResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getAuctionById, getVerificationProof } = useAuctions();
  
  // Default to auction-006 if id not provided or fallback
  const auctionId = id || 'auction-006';
  const auction = getAuctionById(auctionId);
  const proof = getVerificationProof(auctionId);

  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  if (!auction) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Auction Result Not Found</h2>
        <Link to="/auctions">
          <Button variant="primary">Return to Marketplace</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. Header Banner: AUCTION COMPLETE */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-xs font-semibold text-emerald-300 shadow-glow-emerald">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>MIDNIGHT SETTLEMENT FINALIZED</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight font-sans">
          AUCTION COMPLETE
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          The auction for <strong className="text-white">"{auction.title}"</strong> has concluded. The highest valid bid has been verified by the Midnight Compact circuit.
        </p>
      </div>

      {/* 2. Hero Settlement Outcome Card */}
      <Card variant="glow" className="p-6 sm:p-10 border-emerald-500/40 bg-gradient-to-b from-[#091724] to-[#070b16] space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          {/* Winner Address */}
          <div className="space-y-1 md:border-r border-midnight-750 md:pr-6">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Verified Winner
            </span>
            <div className="flex items-center justify-center md:justify-start gap-2 pt-1">
              <Award className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-base font-mono font-bold text-cyan-300">
                {formatAddress(auction.winnerAddress || 'midnight1q8w7e6r5t4y3u2i1o0p9a8s7d6f5g4h3j2', 8, 6)}
              </span>
            </div>
            <span className="text-[11px] text-emerald-400 block pt-0.5">
              Preimage witness authenticated
            </span>
          </div>

          {/* Winning Bid */}
          <div className="space-y-1 md:border-r border-midnight-750 md:pr-6">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Winning Final Bid
            </span>
            <div className="text-2xl font-extrabold text-white font-mono pt-1">
              {formatTDU(auction.winningBidTDU || 9450)}
            </div>
            <span className="text-[11px] text-slate-400 block pt-0.5">
              Settled via Compact state transition
            </span>
          </div>

          {/* Privacy Guarantee Invariant */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Confidentiality State
            </span>
            <div className="inline-flex items-center gap-1.5 text-sm font-bold text-cyan-300 bg-cyan-950/60 px-3 py-1 rounded-xl border border-cyan-500/30 mt-1">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Other bids remain private</span>
            </div>
            <span className="text-[11px] text-slate-400 block pt-0.5">
              {Math.max(1, auction.bidderCount - 1)} losing bids 100% hidden
            </span>
          </div>
        </div>

        {/* Verification Trigger Banner */}
        <div className="p-4 rounded-2xl bg-midnight-950/90 border border-midnight-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">
                Zero-Knowledge Verifier Circuit Proof
              </h4>
              <p className="text-xs text-slate-400">
                Inspect public inputs, Merkle commitments, and Halo2/Groth16 zk-SNARK receipts.
              </p>
            </div>
          </div>

          <Button
            variant="privacy"
            size="sm"
            onClick={() => setIsVerificationModalOpen(true)}
            leftIcon={<ShieldCheck className="w-4 h-4" />}
          >
            View Verification Proof
          </Button>
        </div>
      </Card>

      {/* 3. Deep Dive: How the Winning Result Was Verified */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span>How the Result Was Proven Without Leaking Losing Bids</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <Card variant="glass" className="p-5 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              1
            </div>
            <h4 className="text-sm font-semibold text-white">Commitment Merkle Tree</h4>
            <p className="text-slate-400 leading-relaxed">
              During the auction window, every bidder submitted a blinded hash `Hash(bid || salt || pk)`. These were compiled into an immutable on-chain commitment tree.
            </p>
          </Card>

          <Card variant="glass" className="p-5 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
              2
            </div>
            <h4 className="text-sm font-semibold text-white">ZK Highest-Value Proof</h4>
            <p className="text-slate-400 leading-relaxed">
              The verifier circuit checks that the claimed winning commitment corresponds to the highest numeric valuation among all tree leaves without publishing the other branches.
            </p>
          </Card>

          <Card variant="glass" className="p-5 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              3
            </div>
            <h4 className="text-sm font-semibold text-white">Permanent Confidentiality</h4>
            <p className="text-slate-400 leading-relaxed">
              Losing bidders never reveal their salts or amounts. Their private pricing intelligence remains protected forever on the Midnight ledger.
            </p>
          </Card>
        </div>
      </div>

      {/* 4. Actions Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-midnight-800">
        <Link to={`/auction/${auction.id}`}>
          <Button variant="secondary" size="sm">
            View Full Auction History
          </Button>
        </Link>

        <Link to="/auctions">
          <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Explore More Auctions
          </Button>
        </Link>
      </div>

      {/* Verification Modal */}
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        proof={proof}
        auction={auction}
      />
    </div>
  );
};
