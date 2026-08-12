import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useWallet } from '../../context/WalletContext';
import { Loader2, CheckCircle2, AlertCircle, Shield, Lock } from 'lucide-react';
import { formatAddress } from '../../lib/utils';
import { MIDNIGHT_CONFIG } from '../../lib/midnight/config';

export const TransactionStatusModal: React.FC = () => {
  const { txState, setTxState, account } = useWallet();

  if (!txState) return null;

  const currentNetwork = account?.network || MIDNIGHT_CONFIG.networkId;
  const isCompleted = txState.status === 'confirmed';
  const isFailed = txState.status === 'failed';
  const isLoading = !isCompleted && !isFailed;

  const steps = [
    {
      key: 'generating_proof',
      title: 'Zero-Knowledge Prover',
      desc: 'Constructing Groth16 zk-SNARK witness locally',
    },
    {
      key: 'requesting_signature',
      title: 'Lace Authorization',
      desc: 'Signing confidential state transition',
    },
    {
      key: 'submitting_to_network',
      title: `Midnight ${currentNetwork} Ledger`,
      desc: 'Broadcasting commitment to indexer & consensus',
    },
  ];

  const getCurrentStepIndex = () => {
    switch (txState.status) {
      case 'generating_proof':
        return 0;
      case 'requesting_signature':
        return 1;
      case 'submitting_to_network':
      case 'submitting_to_preprod':
        return 2;
      case 'confirmed':
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = getCurrentStepIndex();

  return (
    <Modal
      isOpen={Boolean(txState)}
      onClose={() => {
        if (!isLoading) setTxState(null);
      }}
      title={txState.title}
      maxWidth="md"
      showCloseButton={!isLoading}
    >
      <div className="space-y-6">
        {/* Status Animation Icon */}
        <div className="flex flex-col items-center justify-center pt-2">
          {isLoading && (
            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              <Shield className="w-4 h-4 text-white absolute" />
            </div>
          )}

          {isCompleted && (
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 shadow-glow-emerald">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          )}

          {isFailed && (
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-400">
              <AlertCircle className="w-8 h-8" />
            </div>
          )}

          <h3 className="text-base font-semibold text-white mt-4 text-center">
            {txState.title}
          </h3>
          <p className="text-xs text-slate-400 text-center max-w-sm mt-1">
            {txState.stepDescription}
          </p>
        </div>

        {/* Multi-step Progress Tracker */}
        <div className="space-y-3 py-2">
          {steps.map((step, idx) => {
            const isDone = currentStep > idx || isCompleted;
            const isCurrent = currentStep === idx && isLoading;

            return (
              <div
                key={step.key}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200'
                    : isDone
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                    : 'bg-midnight-900/40 border-midnight-800 text-slate-500'
                }`}
              >
                <div className="mt-0.5">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-500">
                      {idx + 1}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="text-xs font-semibold text-white">{step.title}</div>
                  <div className="text-[11px] text-slate-400">{step.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Transaction Hashes / Proof Hashes */}
        {(txState.txHash || txState.proofHash) && (
          <div className="p-3 rounded-xl bg-midnight-900 border border-midnight-750 space-y-2 text-xs">
            {txState.proofHash && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  ZK Commitment:
                </span>
                <span className="font-mono text-cyan-300">
                  {formatAddress(txState.proofHash, 10, 8)}
                </span>
              </div>
            )}
            {txState.txHash && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{currentNetwork} Identifier:</span>
                <span className="font-mono text-slate-200">
                  {formatAddress(txState.txHash, 10, 8)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          {isCompleted && (
            <Button
              variant="primary"
              className="w-full"
              onClick={() => setTxState(null)}
            >
              Done
            </Button>
          )}

          {isFailed && (
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setTxState(null)}
            >
              Close
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
