import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { PrivateBid, AuctionItem } from '../../types/auction';
import { formatTDU, formatAddress } from '../../lib/utils';
import { Lock, CheckCircle2, Copy, Check, ShieldCheck, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useWallet } from '../../context/WalletContext';

interface BidSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  bid: PrivateBid | null;
  auction: AuctionItem | null;
}

export const BidSuccessModal: React.FC<BidSuccessModalProps> = ({
  isOpen,
  onClose,
  bid,
  auction,
}) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();
  const { network } = useWallet();

  if (!bid || !auction) return null;

  const handleCopyReceipt = () => {
    const receiptText = `SealBid Confidential Receipt\nNetwork: Midnight ${network}\nAuction: ${auction.title}\nReceipt ID: ${bid.midnightReceiptId}\nCommitment: ${bid.commitmentHash}\nSalt: ${bid.salt}\nTimestamp: ${new Date(bid.submittedAt).toISOString()}`;
    navigator.clipboard.writeText(receiptText);
    setCopied(true);
    showToast('info', 'Receipt Copied', 'Encrypted receipt stored in clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
          <span>PRIVATE BID SUBMITTED</span>
        </div>
      }
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Success Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-midnight-900 to-emerald-950/30 border border-cyan-500/40 text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Confidentiality Guard Activated</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            Your bid amount (<strong className="text-cyan-300 font-mono">{formatTDU(bid.bidAmountTDU)}</strong>) has been sealed into a zero-knowledge commitment. Other bidders and validators on <span className="font-semibold text-cyan-300">Midnight {network}</span> can only verify your cryptographic proof.
          </p>
        </div>

        {/* Receipt Details Box */}
        <div className="rounded-2xl bg-midnight-950/90 border border-midnight-750 p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-midnight-800">
            <span className="text-slate-400">Auction Title:</span>
            <span className="font-semibold text-white truncate max-w-[220px]">{auction.title}</span>
          </div>

          <div className="flex items-center justify-between pb-2.5 border-b border-midnight-800">
            <span className="text-slate-400">Receipt Identifier:</span>
            <span className="font-mono text-cyan-400 font-semibold">{bid.midnightReceiptId}</span>
          </div>

          <div className="flex items-center justify-between pb-2.5 border-b border-midnight-800">
            <span className="text-slate-400">ZK Commitment Hash:</span>
            <span className="font-mono text-slate-200">{formatAddress(bid.commitmentHash, 10, 8)}</span>
          </div>

          <div className="flex items-center justify-between pb-2.5 border-b border-midnight-800">
            <span className="text-slate-400">Transaction Finality:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed ({network})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Witness Protection:</span>
            <span className="text-cyan-300 font-semibold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> Client-Side Only
            </span>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="p-3 rounded-xl bg-midnight-900/60 border border-midnight-800 flex items-start gap-2.5 text-[11px] text-slate-400">
          <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            When the auction timer expires, Midnight's Compact smart contract will evaluate all commitments in zero-knowledge. You will be notified automatically if your bid is the highest.
          </span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Button
            variant="outline"
            className="w-full sm:w-1/2"
            onClick={handleCopyReceipt}
            leftIcon={copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          >
            {copied ? 'Copied Receipt' : 'Copy Bid Receipt'}
          </Button>

          <Button
            variant="primary"
            className="w-full sm:w-1/2"
            onClick={onClose}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};
