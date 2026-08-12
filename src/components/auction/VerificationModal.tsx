import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ZKVerificationProof, AuctionItem } from '../../types/auction';
import { formatAddress, formatDate } from '../../lib/utils';
import { ShieldCheck, Lock, Copy, Check, Cpu } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useWallet } from '../../context/WalletContext';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  proof: ZKVerificationProof | undefined;
  auction: AuctionItem | undefined;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  proof,
  auction,
}) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();
  const { network } = useWallet();

  if (!proof || !auction) return null;

  const handleCopyProof = () => {
    navigator.clipboard.writeText(JSON.stringify(proof, null, 2));
    setCopied(true);
    showToast('info', 'Proof JSON Copied', 'Full cryptographic verification payload copied.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
          <span>Zero-Knowledge Settlement Verification</span>
        </div>
      }
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Verification Status Header */}
        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
              Midnight Compact ZK Proof
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              ✓ Verified on {network}
            </span>
          </div>
          <h3 className="text-base font-bold text-white">
            Winning Bid Proven Cryptographically
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The Midnight Compact circuit verified that <span className="font-mono text-cyan-300">{formatAddress(proof.winnerAddress, 6, 4)}</span> submitted the highest commitment for {auction.title}.
          </p>
        </div>

        {/* Cryptographic Circuit Invariants */}
        <div className="p-4 rounded-2xl bg-midnight-950 border border-midnight-750 space-y-3">
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Circuit Verification Invariants
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-midnight-900 border border-midnight-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Circuit Engine:</span>
              <span className="font-mono text-cyan-300 font-semibold">{proof.circuitName}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-midnight-900 border border-midnight-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Proof Protocol:</span>
              <span className="font-mono text-indigo-300 font-semibold">{proof.proofType}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-midnight-900 border border-midnight-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Verified Timestamp:</span>
              <span className="text-white font-medium">{formatDate(proof.verifiedAt)}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-midnight-900 border border-midnight-800 space-y-1">
              <span className="text-slate-400 text-[11px] block">Confidential Bids Preserved:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Lock className="w-3 h-3" /> {proof.unrevealedLosingBidsCount} bids kept secret
              </span>
            </div>
          </div>
        </div>

        {/* Public Inputs & Commitment Tree */}
        <div className="space-y-2 text-xs">
          <span className="font-semibold text-slate-300 block">
            Public Circuit Inputs (On-Chain State):
          </span>
          <div className="p-3 rounded-xl bg-[#060a14] border border-midnight-800 font-mono text-[11px] text-slate-300 space-y-2 overflow-x-auto">
            <div>
              <span className="text-slate-500">// Merkle Root of All Bid Commitments</span>
              <div className="text-cyan-300">{proof.publicInputs.merkleRootOfCommitments}</div>
            </div>
            <div>
              <span className="text-slate-500">// Highest Valid Commitment Hash</span>
              <div className="text-emerald-400">{proof.publicInputs.highestBidCommitment}</div>
            </div>
          </div>
        </div>

        {/* Confidentiality Guarantee Banner */}
        <div className="p-3.5 rounded-xl bg-midnight-900/90 border border-cyan-500/30 flex items-start gap-3 text-xs text-slate-300">
          <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            <strong className="text-white">Zero-Knowledge Invariant Guarantee:</strong>{' '}
            All other submitted bid amounts remain permanently encrypted. The verifier circuit math mathematically guarantees that no other bidder had a higher amount, without revealing what those losing amounts were.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyProof}
            leftIcon={copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          >
            {copied ? 'Copied Proof' : 'Copy Proof JSON'}
          </Button>

          <Button variant="primary" size="sm" onClick={onClose}>
            Close Verification
          </Button>
        </div>
      </div>
    </Modal>
  );
};
