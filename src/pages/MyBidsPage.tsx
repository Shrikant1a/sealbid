import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuctions } from '../context/AuctionContext';
import { useWallet } from '../context/WalletContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/LoadingSpinner';
import { formatTDU, formatDate } from '../lib/utils';
import { Lock, Eye, EyeOff, ShieldCheck, Copy, Check, ArrowRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const MyBidsPage: React.FC = () => {
  const { userBids } = useAuctions();
  const { account, setIsWalletModalOpen } = useWallet();
  const { showToast } = useToast();

  const [revealedBids, setRevealedBids] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleRevealBid = (bidId: string) => {
    setRevealedBids((prev) => ({ ...prev, [bidId]: !prev[bidId] }));
  };

  const handleCopyCommitment = (commitment: string, id: string) => {
    navigator.clipboard.writeText(commitment);
    setCopiedId(id);
    showToast('info', 'Commitment Hash Copied', 'Copied to clipboard.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!account) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={Lock}
          title="Connect Wallet to View Your Confidential Bids"
          description="Your sealed bid commitments and local witness keys are associated with your Midnight wallet."
          actionText="Connect Wallet"
          onAction={() => setIsWalletModalOpen(true)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-midnight-750">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-semibold text-cyan-300 mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          Shielded Bid Portfolio
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          My Private Sealed Bids
        </h1>
        <p className="text-sm text-slate-300 mt-1 max-w-2xl">
          Your confidential bid receipts. Your plaintext amounts are stored strictly in your local client witness state and are never revealed to competitors.
        </p>
      </div>

      {/* Bid List */}
      {userBids.length > 0 ? (
        <div className="space-y-4">
          {userBids.map((bid) => {
            const isRevealed = Boolean(revealedBids[bid.id]);

            return (
              <Card
                key={bid.id}
                variant="glass"
                className="p-6 border-midnight-700/70 hover:border-cyan-500/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Left Auction Info */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <Badge bidStatus={bid.status} />
                    <span className="text-xs text-slate-400 font-mono">
                      Receipt: <strong className="text-cyan-300">{bid.midnightReceiptId || bid.id}</strong>
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400">
                      Submitted: {formatDate(bid.submittedAt)}
                    </span>
                  </div>

                  <Link to={`/auction/${bid.auctionId}`}>
                    <h3 className="text-base font-bold text-white hover:text-cyan-300 transition-colors truncate">
                      {bid.auctionTitle}
                    </h3>
                  </Link>

                  {/* Commitment Hash Pill */}
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-midnight-950/80 p-2 rounded-xl border border-midnight-800 max-w-xl">
                    <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="text-slate-400">Commitment:</span>
                    <span className="text-slate-200 truncate">{bid.commitmentHash}</span>
                    <button
                      onClick={() => handleCopyCommitment(bid.commitmentHash, bid.id)}
                      className="ml-auto p-1 rounded text-slate-400 hover:text-white"
                      title="Copy commitment hash"
                    >
                      {copiedId === bid.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Right Bid Amount & Reveal Control */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-midnight-750">
                  {/* Private Bid Value Box */}
                  <div className="p-3 rounded-xl bg-midnight-900 border border-midnight-750 text-left sm:text-right min-w-[150px]">
                    <div className="flex items-center justify-between sm:justify-end gap-1.5 text-[11px] text-slate-400 mb-1">
                      <span>Your Local Bid:</span>
                      <button
                        onClick={() => toggleRevealBid(bid.id)}
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        title={isRevealed ? 'Hide plaintext' : 'Show plaintext'}
                      >
                        {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{isRevealed ? 'Hide' : 'Reveal'}</span>
                      </button>
                    </div>

                    <div className="font-mono text-base font-bold text-white">
                      {isRevealed ? (
                        <span className="text-cyan-300">{formatTDU(bid.bidAmountTDU)}</span>
                      ) : (
                        <span className="tracking-widest text-slate-500">••••••••••</span>
                      )}
                    </div>
                  </div>

                  {/* Auction Details CTA */}
                  <Link to={`/auction/${bid.auctionId}`}>
                    <Button variant="secondary" size="sm" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      View Auction
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Lock}
          title="No Sealed Bids Yet"
          description="You haven't participated in any confidential sealed-bid auctions yet. Browse active auctions and submit your first private bid."
          actionText="Explore Active Auctions"
          onAction={() => window.location.assign('/auctions')}
        />
      )}
    </div>
  );
};
