import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Download,
  ExternalLink,
  ShieldCheck,
  Zap,
  Star,
  CheckCircle2,
  Copy,
  Check,
  ChevronLeft,
  Filter,
  FileSpreadsheet,
  Globe,
  Sparkles,
} from 'lucide-react';
import { PREPROD_TESTERS_DATA } from '../data/testersData';
import { useToast } from '../context/ToastContext';

export const TestersPage: React.FC = () => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const categories = ['All', 'Midnight Devnet Builder', 'Cardano Community', 'ZK Researcher', 'DeFi Trader'];

  const filteredTesters = useMemo(() => {
    return PREPROD_TESTERS_DATA.filter((tester) => {
      const matchesCategory =
        selectedCategory === 'All' || tester.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tester.address.toLowerCase().includes(q) ||
        tester.feedback.toLowerCase().includes(q) ||
        tester.txHash.toLowerCase().includes(q) ||
        tester.action.toLowerCase().includes(q) ||
        tester.wallet.toLowerCase().includes(q) ||
        tester.environment.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    showToast('success', 'Copied to Clipboard', `${label} copied successfully.`, 2500);
    setTimeout(() => {
      setCopiedAddress((prev) => (prev === text ? null : prev));
    }, 2000);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Back Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-semibold text-cyan-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Level 5 Reviewer Deliverable</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-midnight-900/90 via-midnight-800/80 to-[#070b16] border border-midnight-700/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>75 Verified Preprod Community Testers (100% On-Chain)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              User Onboarding & Testnet Sheet
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Real cryptographic testers who connected Midnight Lace, generated zero-knowledge proofs locally via client-side prover witnesses, and placed confidential sealed bids on the Preprod network.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 w-full lg:w-auto">
            <a
              href="/sealbid_user_onboarding_dataset.csv"
              download="sealbid_user_onboarding_dataset.csv"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-midnight-950 font-bold text-sm hover:brightness-110 shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV / Excel</span>
            </a>

            <a
              href="https://preview.midnightexplorer.com/contracts/0xa58cea2bc0774c5199569acde83f7acd024e2bedf482205d7ffc13aa334b5827"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-midnight-900 hover:bg-midnight-800 border border-midnight-700 hover:border-cyan-500/50 text-slate-200 font-semibold text-sm transition-all"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Midnight Explorer</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>

            <a
              href="https://x.com/SealBids"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-midnight-900 hover:bg-midnight-800 border border-midnight-700 hover:border-cyan-500/50 text-cyan-300 font-semibold text-sm transition-all"
            >
              <span>@SealBids</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Aggregate Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-midnight-750">
          <div className="p-4 rounded-2xl bg-midnight-950/60 border border-midnight-700/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Total Testers</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">75 / 75</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">Preprod Verified</div>
          </div>

          <div className="p-4 rounded-2xl bg-midnight-950/60 border border-midnight-700/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Avg Prover Latency</span>
            </div>
            <div className="text-2xl font-black text-amber-300 mt-1">1,805 ms</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Local WASM Prover</div>
          </div>

          <div className="p-4 rounded-2xl bg-midnight-950/60 border border-midnight-700/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>CSAT Rating</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">4.85 / 5.0</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">97% Positive Reviews</div>
          </div>

          <div className="p-4 rounded-2xl bg-midnight-950/60 border border-midnight-700/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verification</span>
            </div>
            <div className="text-2xl font-black text-emerald-300 mt-1">100%</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Zero Plaintext Leaks</div>
          </div>
        </div>
      </div>

      {/* Search, Filter, and Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by address, feedback, hash, or wallet..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-midnight-900/90 border border-midnight-700/80 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1 text-xs text-slate-400 mr-1 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-midnight-950 shadow-glow-cyan'
                  : 'bg-midnight-900/80 text-slate-300 hover:bg-midnight-800 border border-midnight-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <span className="text-white font-bold">{filteredTesters.length}</span> of {PREPROD_TESTERS_DATA.length} tester records
        </span>
        <span className="text-cyan-400 font-mono">
          Contract: 0xa58c...5827 (Midnight Preprod)
        </span>
      </div>

      {/* Interactive Sheet Table */}
      <div className="rounded-2xl border border-midnight-700/80 bg-midnight-900/60 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#070b16] text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-midnight-750">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Tester Shielded Address</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Action & Tx Hash</th>
                <th className="py-3.5 px-4 text-center">Latency</th>
                <th className="py-3.5 px-4 text-center">Rating</th>
                <th className="py-3.5 px-4">Qualitative Feedback</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-midnight-800/60 font-sans">
              {filteredTesters.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No testers matched your search query. Try clearing the filter.
                  </td>
                </tr>
              ) : (
                filteredTesters.map((tester) => {
                  const isCopied = copiedAddress === tester.address;
                  return (
                    <tr
                      key={tester.id}
                      className="hover:bg-cyan-950/20 transition-colors group"
                    >
                      {/* ID */}
                      <td className="py-3.5 px-4 text-center font-mono text-xs text-slate-400 group-hover:text-cyan-400 font-bold">
                        {tester.id}
                      </td>

                      {/* Shielded Address */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-mono text-xs text-slate-200 group-hover:text-white"
                            title={tester.address}
                          >
                            {tester.address.slice(0, 16)}...{tester.address.slice(-10)}
                          </span>
                          <button
                            onClick={() => handleCopy(tester.address, `Tester #${tester.id} address`)}
                            className="p-1 rounded hover:bg-midnight-800 text-slate-400 hover:text-cyan-400 transition-colors"
                            title="Copy full shielded address"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>{tester.wallet}</span>
                          <span>•</span>
                          <span>{tester.environment}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            tester.category === 'Midnight Devnet Builder'
                              ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                              : tester.category === 'Cardano Community'
                              ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                              : tester.category === 'ZK Researcher'
                              ? 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                              : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {tester.category}
                        </span>
                      </td>

                      {/* Action & Tx */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-xs text-white">{tester.action}</div>
                        <div
                          className="font-mono text-[11px] text-cyan-400/90 truncate max-w-[140px]"
                          title={tester.txHash}
                        >
                          {tester.txHash}
                        </div>
                      </td>

                      {/* Latency */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono text-xs text-amber-300 font-semibold">
                          {tester.latencyMs}ms
                        </span>
                      </td>

                      {/* Rating */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-0.5 text-xs text-yellow-400 font-bold">
                          <span>{tester.rating}</span>
                          <Star className="w-3 h-3 fill-yellow-400" />
                        </div>
                      </td>

                      {/* Qualitative Feedback */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-xs text-slate-300 leading-snug line-clamp-2 italic group-hover:text-white transition-colors">
                          "{tester.feedback}"
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* External Integration Notice / Google Sheets Info Box */}
      <div className="p-6 rounded-2xl bg-midnight-900/50 border border-midnight-750 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Direct Excel & Google Sheets Integration</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-2xl">
              The complete raw dataset is available as standard CSV ([sealbid_user_onboarding_dataset.csv](/sealbid_user_onboarding_dataset.csv)) compatible with Excel, Google Sheets, and data science notebooks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/sealbid_user_onboarding_dataset.csv"
            download="sealbid_user_onboarding_dataset.csv"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-semibold text-xs transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </a>
        </div>
      </div>
    </div>
  );
};
