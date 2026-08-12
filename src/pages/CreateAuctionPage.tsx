import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuctions } from '../context/AuctionContext';
import { useWallet } from '../context/WalletContext';
import { AUCTION_CATEGORIES } from '../data/categories';
import { AuctionCategory, AuctionItem } from '../types/auction';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { AuctionCard } from '../components/auction/AuctionCard';
import { PlusCircle, Sparkles, AlertCircle, Lock, Clock } from 'lucide-react';

type DurationUnit = 'minutes' | 'hours' | 'days';

export const CreateAuctionPage: React.FC = () => {
  const navigate = useNavigate();
  const { createAuction } = useAuctions();
  const { account, network, setIsWalletModalOpen } = useWallet();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<AuctionCategory>('digital-assets');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80');
  const [startingBid, setStartingBid] = useState('5000');
  const [reservePrice, setReservePrice] = useState('');
  
  // Custom & Preset Duration States
  const [durationPreset, setDurationPreset] = useState<string>('custom');
  const [customValue, setCustomValue] = useState<string>('15');
  const [durationUnit, setDurationUnit] = useState<DurationUnit>('minutes');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const sampleImagePresets = [
    { label: 'Validator / Compute', url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80' },
    { label: 'DeFi Vault', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' },
    { label: 'ZK Algorithm IP', url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Shielded Domain', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80' },
  ];

  const quickDurationPresets = [
    { id: '5m', label: '5 Mins (Fast Test)', minutes: 5 },
    { id: '15m', label: '15 Mins', minutes: 15 },
    { id: '1h', label: '1 Hour', minutes: 60 },
    { id: '6h', label: '6 Hours', minutes: 360 },
    { id: '24h', label: '24 Hours (1 Day)', minutes: 1440 },
    { id: '3d', label: '3 Days', minutes: 4320 },
    { id: 'custom', label: 'Custom Time...', minutes: 0 },
  ];

  // Calculate total minutes based on current selection
  const getTotalDurationMinutes = (): number => {
    if (durationPreset !== 'custom') {
      const preset = quickDurationPresets.find((p) => p.id === durationPreset);
      if (preset && preset.minutes > 0) return preset.minutes;
    }
    const val = parseFloat(customValue) || 15;
    if (durationUnit === 'minutes') return val;
    if (durationUnit === 'hours') return val * 60;
    if (durationUnit === 'days') return val * 1440;
    return val;
  };

  const handleSelectPreset = (presetId: string) => {
    setDurationPreset(presetId);
    if (presetId === '5m') {
      setCustomValue('5');
      setDurationUnit('minutes');
    } else if (presetId === '15m') {
      setCustomValue('15');
      setDurationUnit('minutes');
    } else if (presetId === '1h') {
      setCustomValue('1');
      setDurationUnit('hours');
    } else if (presetId === '6h') {
      setCustomValue('6');
      setDurationUnit('hours');
    } else if (presetId === '24h') {
      setCustomValue('24');
      setDurationUnit('hours');
    } else if (presetId === '3d') {
      setCustomValue('3');
      setDurationUnit('days');
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Item title is required.';
    if (!description.trim() || description.length < 15) errs.description = 'Please provide a descriptive overview (at least 15 characters).';
    if (!startingBid || isNaN(Number(startingBid)) || Number(startingBid) <= 0) {
      errs.startingBid = 'Starting bid must be a positive number.';
    }
    if (reservePrice && (isNaN(Number(reservePrice)) || Number(reservePrice) < Number(startingBid))) {
      errs.reservePrice = 'Reserve price must be greater than or equal to starting bid.';
    }
    
    const minutes = getTotalDurationMinutes();
    if (!minutes || isNaN(minutes) || minutes <= 0) {
      errs.duration = 'Please specify a valid duration (minimum 1 minute).';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      setIsWalletModalOpen(true);
      return;
    }
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const totalMinutes = getTotalDurationMinutes();

      const newAuction = await createAuction({
        title,
        description,
        imageUrl,
        category,
        startingBidTDU: Number(startingBid),
        reservePriceTDU: reservePrice ? Number(reservePrice) : undefined,
        durationMinutes: totalMinutes,
      });

      navigate(`/auction/${newAuction.id}`);
    } catch (err: any) {
      setErrors({ form: err?.message || 'Failed to deploy sealed auction.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentDurationMinutes = getTotalDurationMinutes();

  // Construct Live Preview Auction Object
  const previewAuction: AuctionItem = {
    id: 'preview-auction',
    title: title.trim() || 'Your Auction Item Title Preview',
    description: description.trim() || 'Detailed description of your private auction item will appear here. Participants will place zero-knowledge sealed bids.',
    imageUrl: imageUrl || sampleImagePresets[0].url,
    category,
    sellerAddress: account?.address || 'midnight1qpv6w8e9r2t4y5u7i8o9p0a1s2d3f4g5h6j7k8',
    sellerName: account ? 'You (Connected Wallet)' : 'Your Account',
    startingBidTDU: Number(startingBid) || 5000,
    reservePriceTDU: reservePrice ? Number(reservePrice) : undefined,
    bidderCount: 0,
    startTime: Date.now(),
    endTime: Date.now() + currentDurationMinutes * 60 * 1000,
    status: 'active',
    contractAddress: 'midnight1contract_preview_000',
    isUserSeller: true,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-midnight-750">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-semibold text-cyan-300 mb-2">
          <PlusCircle className="w-3.5 h-3.5" />
          Deploy Compact Auction
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Create Private Sealed Auction
        </h1>
        <p className="text-sm text-slate-300 mt-1 max-w-2xl">
          List digital assets, compute rights, or DeFi collateral on Midnight {network} with mathematically sealed confidential bidding.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7">
          <Card variant="glass" className="p-6 sm:p-8 border-midnight-700/70">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                  Item Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Midnight Genesis Validator License #042"
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />
                {errors.title && <p className="text-xs text-red-400 mt-1.5">{errors.title}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as AuctionCategory)}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white bg-[#0b1020] cursor-pointer"
                >
                  {AUCTION_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-midnight-900 text-white">
                      {cat.name} — {cat.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                  Description *
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the asset, verification proofs included, redemption parameters, and delivery terms..."
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />
                {errors.description && <p className="text-xs text-red-400 mt-1.5">{errors.description}</p>}
              </div>

              {/* Image URL & Preset Selection */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Item Banner Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-500"
                />

                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-[11px] text-slate-400">Quick Presets:</span>
                  {sampleImagePresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className="px-2.5 py-1 rounded-lg text-[11px] bg-midnight-900 hover:bg-midnight-800 border border-midnight-750 text-slate-300 hover:text-white transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Starting Bid & Reserve Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                    Starting Reserve (tDU) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={startingBid}
                    onChange={(e) => setStartingBid(e.target.value)}
                    placeholder="5000"
                    className="w-full px-4 py-3 rounded-xl glass-input font-mono text-sm text-white placeholder-slate-500"
                  />
                  {errors.startingBid && <p className="text-xs text-red-400 mt-1.5">{errors.startingBid}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                    Reserve Price (Optional tDU)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={reservePrice}
                    onChange={(e) => setReservePrice(e.target.value)}
                    placeholder="Optional secret threshold"
                    className="w-full px-4 py-3 rounded-xl glass-input font-mono text-sm text-white placeholder-slate-500"
                  />
                  {errors.reservePrice && <p className="text-xs text-red-400 mt-1.5">{errors.reservePrice}</p>}
                </div>
              </div>

              {/* Flexible Duration & Custom Time Input */}
              <div className="space-y-3 p-4 rounded-2xl bg-midnight-950/80 border border-midnight-750">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    Auction Duration *
                  </label>
                  <span className="text-[11px] font-mono text-cyan-300 font-semibold">
                    Total: {currentDurationMinutes < 60 ? `${currentDurationMinutes} Mins` : currentDurationMinutes < 1440 ? `${(currentDurationMinutes / 60).toFixed(1)} Hours` : `${(currentDurationMinutes / 1440).toFixed(1)} Days`}
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {quickDurationPresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset.id)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-medium transition-all ${
                        durationPreset === preset.id
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm font-semibold'
                          : 'bg-midnight-900 text-slate-400 border border-midnight-800 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Custom Duration Number & Unit Fields */}
                <div className="pt-2 border-t border-midnight-800 flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Custom Duration Value
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      value={customValue}
                      onChange={(e) => {
                        setCustomValue(e.target.value);
                        setDurationPreset('custom');
                      }}
                      placeholder="e.g. 5, 15, 30, 2"
                      className="w-full px-4 py-2.5 rounded-xl glass-input font-mono text-sm text-white placeholder-slate-500"
                    />
                  </div>

                  <div className="w-36">
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Time Unit
                    </label>
                    <select
                      value={durationUnit}
                      onChange={(e) => {
                        setDurationUnit(e.target.value as DurationUnit);
                        setDurationPreset('custom');
                      }}
                      className="w-full px-3 py-2.5 rounded-xl glass-input text-sm text-white bg-[#0b1020] cursor-pointer"
                    >
                      <option value="minutes">Minutes (m)</option>
                      <option value="hours">Hours (h)</option>
                      <option value="days">Days (d)</option>
                    </select>
                  </div>
                </div>

                {errors.duration && <p className="text-xs text-red-400 mt-1">{errors.duration}</p>}
              </div>

              {/* Privacy Notice Banner */}
              <div className="p-4 rounded-xl bg-midnight-950 border border-cyan-500/30 flex items-start gap-3 text-xs text-slate-300">
                <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold text-white block">Compact Smart Contract Privacy Invariant</span>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    As the auction creator, you will not be able to view participant bids while the auction is running. Upon completion, the winning highest bidder will be settled automatically via zero-knowledge proof.
                  </p>
                </div>
              </div>

              {errors.form && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errors.form}</span>
                </div>
              )}

              {/* Submit CTA */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full font-bold shadow-glow-cyan"
                isLoading={isSubmitting}
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                {account ? `Deploy Sealed Auction to ${network}` : 'Connect Wallet to Deploy'}
              </Button>
            </form>
          </Card>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-28">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Live Marketplace Card Preview
            </span>
            <span className="text-[11px] text-slate-500">Updates in real-time</span>
          </div>

          <div className="max-w-md mx-auto lg:max-w-none">
            <AuctionCard auction={previewAuction} />
          </div>
        </div>
      </div>
    </div>
  );
};
