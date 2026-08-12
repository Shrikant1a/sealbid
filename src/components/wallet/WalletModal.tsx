import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useWallet } from '../../context/WalletContext';
import { Shield, CheckCircle2, Sparkles, Lock, ArrowRight, RefreshCw, ExternalLink, Globe } from 'lucide-react';
import { MIDNIGHT_NETWORKS } from '../../lib/midnight/config';

export const WalletModal: React.FC = () => {
  const {
    isWalletModalOpen,
    setIsWalletModalOpen,
    isLaceAvailable,
    connectLace,
    connectPreview,
    checkLace,
    status,
    account,
  } = useWallet();

  const [selectedNetwork, setSelectedNetwork] = useState<string>(account?.network?.toLowerCase() || 'preview');
  const [isLoadingLace, setIsLoadingLace] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConnectLace = async () => {
    try {
      setIsLoadingLace(true);
      setErrorMessage(null);
      await connectLace(selectedNetwork);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Could not connect to Midnight Lace.');
    } finally {
      setIsLoadingLace(false);
    }
  };

  const handleManualCheck = () => {
    const found = checkLace();
    if (found) {
      setErrorMessage(null);
    } else {
      setErrorMessage('Extension not found on window object. If newly opened, please refresh this browser tab.');
    }
  };

  const currentNetworkLabel = MIDNIGHT_NETWORKS[selectedNetwork]?.label || `Midnight ${selectedNetwork}`;

  return (
    <Modal
      isOpen={isWalletModalOpen}
      onClose={() => {
        setErrorMessage(null);
        setIsWalletModalOpen(false);
      }}
      title="Connect Midnight Wallet"
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Network Selector Tabs */}
        <div className="p-2.5 rounded-xl bg-midnight-950 border border-midnight-750 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              Target Network:
            </span>
            <span className="font-semibold text-cyan-300">{currentNetworkLabel}</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {[
              { id: 'preview', label: 'Preview (Lace)' },
              { id: 'preprod', label: 'Preprod' },
              { id: 'devnet', label: 'Devnet' },
            ].map((net) => (
              <button
                key={net.id}
                type="button"
                onClick={() => setSelectedNetwork(net.id)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                  selectedNetwork === net.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                    : 'bg-midnight-900 text-slate-400 border border-midnight-800 hover:text-white'
                }`}
              >
                {net.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Connect your wallet to interact with confidential sealed-bid auctions on{' '}
          <span className="font-semibold text-cyan-400">{currentNetworkLabel}</span>.
        </p>

        {/* Option 1: Real Midnight Lace Extension */}
        <div className="rounded-xl border border-cyan-500/40 bg-midnight-900/90 p-4 transition-all hover:border-cyan-500 shadow-md">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  Midnight Lace Wallet
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    Official
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {currentNetworkLabel} & Native Shielded Keys
                </p>
              </div>
            </div>

            {isLaceAvailable ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready
              </span>
            ) : (
              <button
                type="button"
                onClick={handleManualCheck}
                className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 bg-midnight-800 px-2 py-0.5 rounded-full border border-midnight-700"
                title="Click to re-scan window.midnight"
              >
                <RefreshCw className="w-3 h-3 animate-spin-slow" /> Scan
              </button>
            )}
          </div>

          <div className="space-y-2">
            <Button
              variant="primary"
              size="md"
              className="w-full font-bold shadow-glow-cyan"
              isLoading={isLoadingLace || status === 'connecting'}
              onClick={handleConnectLace}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Connect to {MIDNIGHT_NETWORKS[selectedNetwork]?.label || 'Midnight Lace'}
            </Button>

            <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
              <span>Looking for `window.midnight`</span>
              <a
                href="https://chromewebstore.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Store Page</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-3 p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-300 leading-normal">
              {errorMessage}
              <div className="mt-1 text-[10px] text-slate-400">
                Tip: If Lace is open, try refreshing this browser tab so the content script injects.
              </div>
            </div>
          )}
        </div>

        {/* Option 2: UI Demo & Integration Preview Mode */}
        <div className="rounded-xl border border-midnight-700/60 bg-midnight-900/40 p-4 transition-all hover:border-slate-600">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Developer Preview Session
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Test UI workflows, bid sealing, and verification circuits locally
                </p>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
            Generates a local shielded keypair session to explore private auction creation and sealed bidding.
          </p>

          <Button
            variant="secondary"
            size="sm"
            className="w-full text-xs"
            onClick={connectPreview}
            leftIcon={<Lock className="w-3.5 h-3.5 text-cyan-400" />}
          >
            Launch Preview Session
          </Button>
        </div>

        {/* Footer Privacy Guarantee */}
        <div className="p-3 rounded-xl bg-[#070b16] border border-midnight-800/80 flex items-center gap-2.5 text-[11px] text-slate-400">
          <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            Your private keys and bid amounts are calculated locally. No private witnesses are ever transmitted in plaintext.
          </span>
        </div>
      </div>
    </Modal>
  );
};
