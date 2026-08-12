import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuctions } from '../context/AuctionContext';
import { PrivateBidPanel } from '../components/auction/PrivateBidPanel';
import { BidSuccessModal } from '../components/auction/BidSuccessModal';
import { VerificationModal } from '../components/auction/VerificationModal';
import { Badge } from '../components/common/Badge';
import { PrivacyBadge } from '../components/common/PrivacyBadge';
import { CountdownTimer } from '../components/common/CountdownTimer';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { formatTDU, formatAddress } from '../lib/utils';
import { PrivateBid } from '../types/auction';
import {
  ArrowLeft,
  Shield,
  Lock,
  Users,
  ExternalLink,
  CheckCircle2,
  FileCheck,
  Award,
  Sparkles,
  Hourglass
} from 'lucide-react';
import { MIDNIGHT_CONFIG } from '../lib/midnight/config';

export const AuctionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAuctionById, getVerificationProof, getUserBidForAuction, settleAuction } = useAuctions();

  const auction = getAuctionById(id || '');
  const verificationProof = id ? getVerificationProof(id) : undefined;
  const userBid = id ? getUserBidForAuction(id) : undefined;

  const [submittedBid, setSubmittedBid] = useState<PrivateBid | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isSettling, setIsSettling] = useState(false);

  if (!auction) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Auction Not Found</h2>
        <p className="text-sm text-slate-400">The requested auction could not be located on the ledger.</p>
        <Link to="/auctions">
          <Button variant="primary">Return to Marketplace</Button>
        </Link>
      </div>
    );
  }

  const isCompleted = auction.status === 'completed';
  const isEnded = isCompleted || auction.status === 'ended' || Date.now() >= auction.endTime;

  const handleBidSuccess = (bid: PrivateBid) => {
    setSubmittedBid(bid);
    setIsSuccessModalOpen(true);
  };

  const handleSettle = async () => {
    try {
      setIsSettling(true);
      await settleAuction(auction.id);
      setIsVerificationModalOpen(true);
    } finally {
      setIsSettling(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button & Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Auctions</span>
        </button>

        <div className="flex items-center gap-2">
          <Badge status={auction.status} endTime={auction.endTime} />
          <PrivacyBadge type={isCompleted ? 'winner-verified' : 'private-bid'} />
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image, Description, Privacy Model, Activity */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Item Card */}
          <Card variant="glass" className="p-0 overflow-hidden border-midnight-700/70">
            <div className="relative aspect-[16/9] w-full bg-midnight-950">
              <img
                src={auction.imageUrl}
                alt={auction.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1020] via-transparent to-transparent" />
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
                  <span>{auction.category.replace('-', ' ')}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400 font-mono">
                    Contract: {formatAddress(auction.contractAddress, 8, 6)}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {auction.title}
                </h1>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Item Description
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {auction.description}
                </p>
              </div>

              {/* Creator / Seller Info Box */}
              <div className="p-4 rounded-2xl bg-midnight-900/80 border border-midnight-750 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Listed By Seller:</span>
                  <div className="font-semibold text-white flex items-center gap-2">
                    <span>{auction.sellerName || 'Anonymous Seller'}</span>
                    <span className="font-mono text-cyan-400 font-normal text-[11px]">
                      ({formatAddress(auction.sellerAddress, 6, 4)})
                    </span>
                  </div>
                </div>

                <a
                  href={`${MIDNIGHT_CONFIG.explorerUrl}/address/${auction.sellerAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 text-xs font-medium"
                >
                  <span>Verify on Explorer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </Card>

          {/* Privacy Architecture Guarantee Card */}
          <Card variant="glass" className="p-6 border-cyan-500/30 space-y-4">
            <div className="flex items-center gap-2.5 text-cyan-300">
              <Shield className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Confidentiality Safeguards</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This auction runs under Midnight’s Zero-Knowledge Sealed-Bid Protocol. The rules below are enforced at the smart contract circuit level:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-midnight-950 border border-midnight-800 space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  Blind Submissions
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Neither the seller nor other bidders can inspect your bid amount prior to close.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-midnight-950 border border-midnight-800 space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ZK Winner Settlement
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  The winning bid is proven mathematically. Losing bid values are never revealed.
                </p>
              </div>
            </div>
          </Card>

          {/* Anonymized Bidding Activity Section */}
          <Card variant="glass" className="p-6 border-midnight-700/60 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Anonymized Sealed Bid Activity</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {auction.bidderCount} Total Commitments
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              Only public cryptographic commitment hashes are displayed. Bid amounts remain confidential to their owners.
            </p>

            <div className="space-y-2">
              {auction.bidderCount > 0 ? (
                Array.from({ length: Math.min(5, auction.bidderCount) }).map((_, i) => {
                  const isUserCommitment = i === 0 && userBid;
                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                        isUserCommitment
                          ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200'
                          : 'bg-midnight-950/60 border-midnight-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Lock className="w-3.5 h-3.5 text-cyan-400" />
                        <div>
                          <span className="font-mono text-[11px] block">
                            Commitment #{auction.bidderCount - i}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono truncate max-w-[180px] sm:max-w-[240px] block">
                            {isUserCommitment
                              ? formatAddress(userBid.commitmentHash, 8, 6)
                              : `0xzk_commit_${(9823412 + i * 19283).toString(16)}...`}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] font-semibold text-emerald-400 block">
                          🔒 Amount Sealed
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {isUserCommitment ? 'Your Bid (Encrypted)' : 'Confidential Bidder'}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 rounded-xl bg-midnight-950/50 border border-midnight-800 text-center text-xs text-slate-500">
                  No sealed bids submitted yet.
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Key Stats, Settlement Card, or Bid Panel */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          {/* Auction Overview Box */}
          <Card variant="glass" className="p-6 border-midnight-700/80 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-midnight-750">
              <div>
                <span className="text-xs text-slate-400 block">
                  {isCompleted ? 'Winning Verified Bid' : 'Starting Reserve Price'}
                </span>
                <span className="text-2xl font-black text-white font-mono">
                  {formatTDU(isCompleted ? auction.winningBidTDU : auction.startingBidTDU)}
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Auction Status</span>
                <Badge status={auction.status} endTime={auction.endTime} />
              </div>
            </div>

            {/* Countdown / Completion Box */}
            <div className="p-4 rounded-xl bg-midnight-950 border border-midnight-750 flex flex-col items-center justify-center text-center space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {isCompleted ? 'Auction Finalized' : isEnded ? 'Auction Timer Concluded' : 'Time Remaining to Bid'}
              </span>
              {isCompleted ? (
                <div className="text-emerald-400 font-semibold text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Verified on Midnight Ledger
                </div>
              ) : (
                <CountdownTimer endTime={auction.endTime} variant="boxes" />
              )}
            </div>

            {/* If Ended but Not Yet Settled: Action Banner to Trigger Settlement */}
            {isEnded && !isCompleted && (
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/40 space-y-3">
                <div className="flex items-center gap-2 text-purple-300 font-semibold text-xs">
                  <Hourglass className="w-4 h-4 text-purple-400" />
                  <span>Bidding Window Closed</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-normal">
                  The auction timer has expired. Execute zero-knowledge settlement to verify the winning bidder while keeping all losing amounts secret.
                </p>
                <Button
                  variant="primary"
                  size="md"
                  className="w-full font-bold shadow-glow-cyan"
                  isLoading={isSettling}
                  onClick={handleSettle}
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  Settle & Declare Winner (ZK Proof)
                </Button>
              </div>
            )}

            {/* If Completed: Winner & Verification Banner */}
            {isCompleted && (
              <div className="p-4 rounded-2xl bg-emerald-950/25 border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-400" />
                    Verified Winner:
                  </span>
                  <span className="font-mono text-cyan-300 font-bold">
                    {formatAddress(auction.winnerAddress, 6, 4)}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-normal">
                  The winning bid of <strong>{formatTDU(auction.winningBidTDU)}</strong> was proven highest. Other bids remain 100% confidential.
                </p>

                {verificationProof && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    leftIcon={<FileCheck className="w-3.5 h-3.5" />}
                    onClick={() => setIsVerificationModalOpen(true)}
                  >
                    View Settlement Proof
                  </Button>
                )}
              </div>
            )}
          </Card>

          {/* Private Bidding Panel (Only shown while auction is actively open) */}
          <PrivateBidPanel
            auction={auction}
            onBidSuccess={handleBidSuccess}
            onSettleRequest={handleSettle}
          />
        </div>
      </div>

      {/* Modals */}
      <BidSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        bid={submittedBid}
        auction={auction}
      />

      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        proof={verificationProof}
        auction={auction}
      />
    </div>
  );
};
