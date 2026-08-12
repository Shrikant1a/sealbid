import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuctions } from '../context/AuctionContext';
import { useWallet } from '../context/WalletContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/LoadingSpinner';
import { VerificationModal } from '../components/auction/VerificationModal';
import { formatTDU } from '../lib/utils';
import { Layers, PlusCircle, CheckCircle2, Users, FileCheck } from 'lucide-react';
import { AuctionItem, ZKVerificationProof } from '../types/auction';

export const MyAuctionsPage: React.FC = () => {
  const { userAuctions, settleAuction, getVerificationProof } = useAuctions();
  const { account, network, setIsWalletModalOpen } = useWallet();

  const [settlingId, setSettlingId] = useState<string | null>(null);
  const [selectedProof, setSelectedProof] = useState<ZKVerificationProof | undefined>(undefined);
  const [selectedAuction, setSelectedAuction] = useState<AuctionItem | undefined>(undefined);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const handleSettle = async (auctionId: string) => {
    try {
      setSettlingId(auctionId);
      const proof = await settleAuction(auctionId);
      const target = userAuctions.find((a) => a.id === auctionId);
      setSelectedProof(proof);
      setSelectedAuction(target);
      setIsVerificationModalOpen(true);
    } finally {
      setSettlingId(null);
    }
  };

  const handleViewProof = (auction: AuctionItem) => {
    const proof = getVerificationProof(auction.id);
    setSelectedProof(proof);
    setSelectedAuction(auction);
    setIsVerificationModalOpen(true);
  };

  if (!account) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={Layers}
          title="Connect Wallet to View Your Auctions"
          description={`Connect your Midnight Lace wallet to manage auctions you created on Midnight ${network}, check sealed bidder counts, and execute zero-knowledge settlements.`}
          actionText="Connect Wallet"
          onAction={() => setIsWalletModalOpen(true)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-midnight-750">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-semibold text-cyan-300 mb-2">
            <Layers className="w-3.5 h-3.5" />
            Seller Dashboard
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            My Created Auctions
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Manage your confidential auction contracts deployed on Midnight {network}.
          </p>
        </div>

        <Link to="/create">
          <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Create New Auction
          </Button>
        </Link>
      </div>

      {/* Auction List */}
      {userAuctions.length > 0 ? (
        <div className="space-y-4">
          {userAuctions.map((auction) => {
            const isCompleted = auction.status === 'completed';
            const isSettling = settlingId === auction.id;

            return (
              <Card
                key={auction.id}
                variant="glass"
                className="p-6 border-midnight-700/70 hover:border-cyan-500/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Left Item Info */}
                <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                  <img
                    src={auction.imageUrl}
                    alt={auction.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-midnight-700 shrink-0 bg-midnight-950"
                  />
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                        {auction.category.replace('-', ' ')}
                      </span>
                      <Badge status={auction.status} size="sm" />
                    </div>

                    <Link to={`/auction/${auction.id}`}>
                      <h3 className="text-base font-bold text-white hover:text-cyan-300 transition-colors truncate">
                        {auction.title}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                      <span>Reserve: <strong className="text-white font-mono">{formatTDU(auction.startingBidTDU)}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-cyan-400" />
                        <strong className="text-white">{auction.bidderCount}</strong> Sealed Bids
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Result / Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-midnight-750">
                  {isCompleted ? (
                    <div className="flex items-center gap-3">
                      <div className="text-left sm:text-right">
                        <span className="text-[11px] text-slate-400 block font-medium">
                          Winning Highest Bid:
                        </span>
                        <span className="text-sm font-bold text-emerald-400 font-mono">
                          {formatTDU(auction.winningBidTDU)}
                        </span>
                      </div>

                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<FileCheck className="w-3.5 h-3.5 text-cyan-400" />}
                        onClick={() => handleViewProof(auction)}
                      >
                        View Proof
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        isLoading={isSettling}
                        onClick={() => handleSettle(auction.id)}
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                      >
                        Settle & Verify Winner
                      </Button>

                      <Link to={`/auction/${auction.id}`}>
                        <Button variant="secondary" size="sm">
                          Details
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Layers}
          title="No Auctions Created Yet"
          description={`You have not deployed any confidential auctions. Create your first auction on Midnight ${network} to get started.`}
          actionText="Create Sealed Auction"
          onAction={() => window.location.assign('/create')}
        />
      )}

      {/* Verification Modal */}
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        proof={selectedProof}
        auction={selectedAuction}
      />
    </div>
  );
};
