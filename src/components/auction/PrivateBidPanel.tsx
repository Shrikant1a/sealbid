import React, { useState, useEffect } from 'react';
import { AuctionItem, PrivateBid } from '../../types/auction';
import { useWallet } from '../../context/WalletContext';
import { useAuctions } from '../../context/AuctionContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { PrivacyBadge } from '../common/PrivacyBadge';
import { formatTDU, generateRandomSalt, computeCommitmentHash } from '../../lib/utils';
import { Lock, Shield, AlertCircle, CheckCircle2, Info, RefreshCw, Sparkles, Hourglass } from 'lucide-react';

interface PrivateBidPanelProps {
  auction: AuctionItem;
  onBidSuccess: (bid: PrivateBid) => void;
  onSettleRequest?: () => void;
}

export const PrivateBidPanel: React.FC<PrivateBidPanelProps> = ({
  auction,
  onBidSuccess,
  onSettleRequest,
}) => {
  const { account, network, setIsWalletModalOpen } = useWallet();
  const { submitPrivateBid, getUserBidForAuction, settleAuction } = useAuctions();

  const [bidAmount, setBidAmount] = useState<string>('');
  const [salt, setSalt] = useState<string>('');
  const [commitmentPreview, setCommitmentPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSettling, setIsSettling] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const existingUserBid = getUserBidForAuction(auction.id);
  const isCompleted = auction.status === 'completed';
  const isTimeExpired = Date.now() >= auction.endTime;
  const isAuctionClosed = isCompleted || auction.status === 'ended' || isTimeExpired;

  // Initialize private witness salt
  useEffect(() => {
    setSalt(generateRandomSalt());
  }, [auction.id]);

  // Compute live commitment hash preview
  useEffect(() => {
    let isMounted = true;
    const num = parseFloat(bidAmount);
    if (!isNaN(num) && num > 0 && account?.address && salt) {
      computeCommitmentHash(num, salt, account.address).then((hash) => {
        if (isMounted) setCommitmentPreview(hash);
      });
    } else {
      setCommitmentPreview('');
    }
    return () => {
      isMounted = false;
    };
  }, [bidAmount, salt, account?.address]);

  const handleRefreshSalt = () => {
    setSalt(generateRandomSalt());
  };

  const handleQuickAdd = (increment: number) => {
    const current = parseFloat(bidAmount) || auction.startingBidTDU;
    setBidAmount((current + increment).toString());
    setErrorMsg(null);
  };

  const validateBid = (): number | null => {
    if (!bidAmount.trim()) {
      setErrorMsg('Please enter a valid bid amount.');
      return null;
    }
    const num = parseFloat(bidAmount);
    if (isNaN(num) || num <= 0) {
      setErrorMsg('Please enter a positive numeric bid amount.');
      return null;
    }
    if (num < auction.startingBidTDU) {
      setErrorMsg(`Bid amount must be at least the starting reserve of ${formatTDU(auction.startingBidTDU)}.`);
      return null;
    }
    if (account && num > account.balanceTDU) {
      setErrorMsg(`Insufficient balance. You have ${formatTDU(account.balanceTDU)} available.`);
      return null;
    }
    setErrorMsg(null);
    return num;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      setIsWalletModalOpen(true);
      return;
    }

    const validatedAmount = validateBid();
    if (!validatedAmount) return;

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      const bid = await submitPrivateBid(auction.id, validatedAmount);
      onBidSuccess(bid);
      setBidAmount('');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to construct or submit private sealed bid.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTriggerSettle = async () => {
    if (onSettleRequest) {
      onSettleRequest();
      return;
    }
    try {
      setIsSettling(true);
      await settleAuction(auction.id);
    } finally {
      setIsSettling(false);
    }
  };

  // If Completed & Settled
  if (isCompleted) {
    return (
      <Card variant="glass" className="p-6 border-emerald-500/40 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-3 text-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
          <h4 className="text-base font-semibold text-white">Auction Settled & Verified</h4>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          The auction has concluded. The winning highest bidder has been cryptographically proven via the Midnight Compact circuit.
        </p>

        {existingUserBid && (
          <div className="p-4 rounded-xl bg-midnight-950 border border-midnight-750 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Your Confidential Bid:</span>
              <span className="font-mono text-cyan-300 font-bold">{formatTDU(existingUserBid.bidAmountTDU)}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-midnight-850 text-[11px]">
              <span className="text-slate-400">Outcome:</span>
              {existingUserBid.status === 'won' || existingUserBid.isWinner ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  🏆 Winning Bid!
                </span>
              ) : (
                <span className="text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-500" /> Kept Private (Unrevealed)
                </span>
              )}
            </div>
          </div>
        )}
      </Card>
    );
  }

  // If Time Expired but Not Yet Settled
  if (isAuctionClosed) {
    return (
      <Card variant="glass" className="p-6 border-purple-500/40 relative overflow-hidden space-y-4">
        <div className="flex items-center gap-2.5 text-purple-300">
          <Hourglass className="w-5 h-5 text-purple-400" />
          <div>
            <h4 className="text-base font-semibold text-white">Bidding Window Concluded</h4>
            <span className="text-[11px] text-slate-400">Timer expired — no new bids can be submitted</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The deadline for this sealed auction has elapsed. Execute zero-knowledge settlement to verify the highest bidder on Midnight {network}.
        </p>

        {existingUserBid && (
          <div className="p-3.5 rounded-xl bg-midnight-950 border border-midnight-800 text-xs space-y-1">
            <span className="text-slate-400 block font-medium">Your Submitted Sealed Bid:</span>
            <span className="font-mono text-cyan-300 font-bold">{formatTDU(existingUserBid.bidAmountTDU)}</span>
            <span className="text-[11px] text-slate-500 block">Status: Sealed (Awaiting Settlement)</span>
          </div>
        )}

        <Button
          variant="primary"
          size="md"
          className="w-full font-bold shadow-glow-cyan"
          isLoading={isSettling}
          onClick={handleTriggerSettle}
          leftIcon={<Sparkles className="w-4 h-4" />}
        >
          Settle & Declare Winner (ZK Proof)
        </Button>
      </Card>
    );
  }

  return (
    <Card variant="glass" className="p-6 border-cyan-500/30 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="bg-ambient-glow w-48 h-48 bg-cyan-500/10 top-0 right-0" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-midnight-700/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Your bid is private</h3>
            <span className="text-[11px] text-slate-400">Midnight Zero-Knowledge Sealed Bid</span>
          </div>
        </div>
        <PrivacyBadge type="private-bid" size="sm" />
      </div>

      {/* Existing Bid Reminder if user already bid */}
      {existingUserBid && (
        <div className="mb-4 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-2.5 text-xs text-cyan-200">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span>You currently have an active sealed bid of </span>
            <strong className="font-mono text-white">{formatTDU(existingUserBid.bidAmountTDU)}</strong>.
            <span className="text-[11px] text-cyan-300/80 block mt-0.5">
              Submitting a new bid will replace your previous confidential commitment.
            </span>
          </div>
        </div>
      )}

      {/* Bid Submission Instructions */}
      <div className="mb-4 p-3 rounded-xl bg-midnight-950/60 border border-midnight-800/80 space-y-2">
        <h4 className="text-[12px] font-semibold text-slate-200">How to place a sealed bid:</h4>
        <ol className="list-decimal pl-4 text-[11px] text-slate-400 space-y-1 marker:text-cyan-500">
          <li>Enter a bid amount higher than the starting reserve (<strong className="text-white">{formatTDU(auction.startingBidTDU)}</strong>).</li>
          <li>Your wallet will generate a cryptographic salt to secure your bid.</li>
          <li>Submit the transaction. Only a <em>hash commitment</em> is recorded on the public ledger.</li>
        </ol>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bid Input */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <label htmlFor="bid-amount" className="font-semibold text-slate-200">
              Enter your bid
            </label>
            <span className="text-slate-400">
              Min: <strong className="text-white font-mono">{formatTDU(auction.startingBidTDU)}</strong>
            </span>
          </div>

          <div className="relative">
            <input
              id="bid-amount"
              type="number"
              step="any"
              min={auction.startingBidTDU}
              value={bidAmount}
              onChange={(e) => {
                setBidAmount(e.target.value);
                setErrorMsg(null);
              }}
              placeholder={`e.g. ${(auction.startingBidTDU * 1.25).toFixed(0)}`}
              className="w-full pl-4 pr-16 py-3 rounded-xl glass-input text-base font-mono font-semibold text-white placeholder-slate-500 focus:border-cyan-400"
              disabled={isSubmitting}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-cyan-400 font-mono">
              tDU
            </span>
          </div>

          {/* Quick Increment Buttons */}
          <div className="flex items-center gap-1.5 mt-2">
            {[100, 500, 1000, 2500].map((inc) => (
              <button
                key={inc}
                type="button"
                onClick={() => handleQuickAdd(inc)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-midnight-900/80 hover:bg-midnight-800 text-slate-300 hover:text-white border border-midnight-750 transition-colors"
              >
                +{inc} tDU
              </button>
            ))}
          </div>
        </div>

        {/* Cryptographic Witness & Salt Accordion */}
        <div className="p-3.5 rounded-xl bg-midnight-950/80 border border-midnight-750 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              Witness Randomness (Salt)
            </span>
            <button
              type="button"
              onClick={handleRefreshSalt}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              title="Generate new randomness"
            >
              <RefreshCw className="w-3 h-3" />
              Regenerate
            </button>
          </div>
          <div className="text-[11px] font-mono text-slate-400 truncate bg-midnight-900/90 p-2 rounded-lg border border-midnight-800">
            {salt}
          </div>

          {commitmentPreview && (
            <div className="pt-1.5 border-t border-midnight-800">
              <div className="text-[11px] text-slate-400 mb-1">
                On-Chain Commitment (ZK Public Output):
              </div>
              <div className="text-[11px] font-mono text-cyan-300 truncate bg-cyan-950/30 p-2 rounded-lg border border-cyan-500/20">
                {commitmentPreview}
              </div>
            </div>
          )}
        </div>

        {/* Privacy Explanation Banner */}
        <div className="p-3 rounded-xl bg-[#06101f] border border-midnight-700/80 flex items-start gap-2.5 text-xs text-slate-300">
          <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            <strong className="text-white">Your bid amount will not be visible to other participants.</strong>{' '}
            Only the cryptographic commitment hash is broadcast to Midnight {network}.
          </p>
        </div>

        {/* Validation / Error Message */}
        {errorMsg && (
          <div aria-live="assertive" className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center gap-2 text-xs text-red-300 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit Button */}
        {account ? (
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full font-bold shadow-glow-cyan"
            isLoading={isSubmitting}
            leftIcon={<Lock className="w-4 h-4" />}
          >
            Submit Private Bid
          </Button>
        ) : (
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => setIsWalletModalOpen(true)}
            leftIcon={<Shield className="w-4 h-4" />}
          >
            Connect Wallet to Bid
          </Button>
        )}
      </form>
    </Card>
  );
};
