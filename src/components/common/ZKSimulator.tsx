import React, { useState, useEffect } from 'react';
import { generateRandomSalt, computeCommitmentHash } from '../../lib/utils';
import { Lock, Shield, Sparkles, RefreshCw, CheckCircle2, ArrowRight, Eye, EyeOff, Cpu } from 'lucide-react';
import { Button } from './Button';

export const ZKSimulator: React.FC = () => {
  const [testAmount, setTestAmount] = useState<number>(750);
  const [testSalt, setTestSalt] = useState<string>('');
  const [commitment, setCommitment] = useState<string>('');
  const [isProving, setIsProving] = useState<boolean>(false);
  const [proofVerified, setProofVerified] = useState<boolean>(false);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [stepStage, setStepStage] = useState<string>('idle');

  const dummyAddress = 'mn_shield-addr_preprod1mmge7upehustg7z2qyspk20pzulc9xu8c0cjgfunasz3cz6';

  // Generate initial salt
  useEffect(() => {
    const s = generateRandomSalt();
    setTestSalt(s);
  }, []);

  // Compute commitment
  useEffect(() => {
    let mounted = true;
    if (testSalt && testAmount > 0) {
      computeCommitmentHash(testAmount, testSalt, dummyAddress).then((c) => {
        if (mounted) setCommitment(c);
      });
    }
    return () => { mounted = false; };
  }, [testAmount, testSalt]);

  const handleSimulateProof = () => {
    setIsProving(true);
    setProofVerified(false);
    setStepStage('synthesizing');

    setTimeout(() => {
      setStepStage('proving');
      setTimeout(() => {
        setStepStage('verifying');
        setTimeout(() => {
          setIsProving(false);
          setProofVerified(true);
          setStepStage('done');
        }, 600);
      }, 700);
    }, 600);
  };

  return (
    <div className="relative rounded-3xl p-6 md:p-8 bg-gradient-to-b from-midnight-900/90 via-midnight-950 to-[#04060c] border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">
      {/* Background neon ambient accent */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="zk-scan-line" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-midnight-750/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-bold text-cyan-300 uppercase tracking-widest mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Interactive Cryptography Sandbox
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            How Midnight Shields Your Valuation
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium">Target Network:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-[11px] font-bold text-indigo-300">
            Midnight Preprod
          </span>
        </div>
      </div>

      {/* Interactive Controls & Live Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Col: User Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-midnight-900/80 border border-midnight-750/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Simulated Secret Bid Amount</span>
              </label>
              <button
                type="button"
                onClick={() => setRevealed(!revealed)}
                className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{revealed ? 'Mask' : 'Inspect'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={testAmount}
                onChange={(e) => {
                  setTestAmount(Number(e.target.value));
                  setProofVerified(false);
                }}
                className="flex-1 accent-cyan-400 h-2 bg-midnight-950 rounded-lg cursor-pointer"
              />
              <div className="w-24 text-right font-mono font-bold text-base text-cyan-300 bg-midnight-950 px-2.5 py-1 rounded-lg border border-midnight-700">
                {revealed ? `${testAmount} tDU` : '•••••••'}
              </div>
            </div>

            <div className="flex items-center gap-1.5 pt-1">
              {[250, 500, 1000, 2500].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setTestAmount(preset);
                    setProofVerified(false);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-all ${
                    testAmount === preset
                      ? 'bg-cyan-500 text-midnight-950'
                      : 'bg-midnight-800 text-slate-400 hover:text-white hover:bg-midnight-700'
                  }`}
                >
                  +{preset}
                </button>
              ))}
            </div>
          </div>

          {/* Secret Salt Generator */}
          <div className="p-4 rounded-2xl bg-midnight-900/80 border border-midnight-750/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span>32-Byte Secret Witness Salt</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setTestSalt(generateRandomSalt());
                  setProofVerified(false);
                }}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                title="Regenerate entropy"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Entropy</span>
              </button>
            </div>
            <div className="font-mono text-[10px] text-slate-400 bg-midnight-950 p-2.5 rounded-xl border border-midnight-800 truncate select-all">
              {revealed ? testSalt : `${testSalt.slice(0, 12)}••••••••••••••••••••••••••••••••`}
            </div>
            <p className="text-[10px] text-slate-500">
              Generated locally in browser memory. Never leaves your device.
            </p>
          </div>
        </div>

        {/* Center Indicator */}
        <div className="hidden lg:flex lg:col-span-1 justify-center">
          <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        {/* Right Col: Public Output & Proof Simulation */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0b1426] to-[#080d1a] border border-cyan-500/40 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Public Ledger State (What Midnight Stores)</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                100% Shielded
              </span>
            </div>

            <div className="p-3 rounded-xl bg-midnight-950/90 border border-midnight-700/80 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block">
                Cryptographic Commitment Hash:
              </span>
              <span className="font-mono text-xs font-bold text-cyan-300 break-all select-all block">
                {commitment || 'Computing...'}
              </span>
            </div>

            <div className="text-[11px] text-slate-300 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                Zero leakage: The seller and competing bidders see <strong>only this 32-byte hash</strong>.
              </span>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                className="w-full font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                isLoading={isProving}
                onClick={handleSimulateProof}
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                {isProving ? (
                  stepStage === 'synthesizing' ? 'Synthesizing ZK Constraints...' :
                  stepStage === 'proving' ? 'Computing Halo2 Proof...' : 'Verifying Circuit on Consensus...'
                ) : (
                  'Run Zero-Knowledge Settlement Verification'
                )}
              </Button>
            </div>

            {proofVerified && (
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 text-xs space-y-1.5 animate-fadeIn">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>ZK-SNARK Proof Verified: TRUE</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Circuit proven: `Verify(π, PublicCommitment) == 1`. The highest bid is cryptographically confirmed while preserving absolute bid confidentiality!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
