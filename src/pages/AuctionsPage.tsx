import React from 'react';
import { useAuctions } from '../context/AuctionContext';
import { AuctionCard } from '../components/auction/AuctionCard';
import { AuctionFilter } from '../components/auction/AuctionFilter';
import { EmptyState } from '../components/common/LoadingSpinner';
import { Gavel, Lock, LayoutGrid, List } from 'lucide-react';
import { formatTDU } from '../lib/utils';

export const AuctionsPage: React.FC = () => {
  const { filteredAuctions, auctions, filterOptions, setFilterOptions } = useAuctions();
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  // Compute marketplace stats
  const activeCount = auctions.filter((a) => a.status === 'active' || a.status === 'closing_soon').length;
  const totalBids = auctions.reduce((acc, a) => acc + a.bidderCount, 0);
  const totalVolumeTDU = auctions.reduce((acc, a) => acc + (a.winningBidTDU || a.startingBidTDU), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative">
      {/* Background ambient glow */}
      <div className="bg-ambient-glow w-[500px] h-[500px] bg-cyan-600/10 top-10 left-1/4 -translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="bg-ambient-glow w-[400px] h-[400px] bg-indigo-600/10 top-40 right-10 blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-midnight-750 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-semibold text-cyan-300 mb-2">
            <Lock className="w-3.5 h-3.5" />
            Confidential Marketplace
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Explore Sealed-Bid Auctions
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Submit confidential bids on digital assets, compute credits, and DeFi collateral without leaking your valuation.
          </p>
        </div>

        {/* Quick Stats Bar */}
        <div className="flex items-center gap-3 bg-midnight-900/80 border border-midnight-750 p-2.5 rounded-2xl shadow-lg">
          <div className="px-3 py-1 text-center">
            <span className="text-xs text-slate-400 block font-medium">Active Auctions</span>
            <span className="text-base font-bold text-white font-mono">{activeCount}</span>
          </div>
          <div className="h-8 w-px bg-midnight-750" />
          <div className="px-3 py-1 text-center">
            <span className="text-xs text-slate-400 block font-medium">Total Sealed Bids</span>
            <span className="text-base font-bold text-cyan-400 font-mono">{totalBids}</span>
          </div>
          <div className="h-8 w-px bg-midnight-750" />
          <div className="px-3 py-1 text-center">
            <span className="text-xs text-slate-400 block font-medium">Reserve Depth</span>
            <span className="text-base font-bold text-indigo-300 font-mono">{formatTDU(totalVolumeTDU)}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search controls + View Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 relative z-10">
        <div className="flex-1">
          <AuctionFilter
            filters={filterOptions}
            onChange={setFilterOptions}
            totalCount={auctions.length}
          />
        </div>

        <div className="hidden md:flex items-center bg-midnight-900/90 border border-midnight-700/80 p-1 rounded-xl self-start">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Auction Cards Grid */}
      <div className="relative z-10">
        {filteredAuctions.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid grid-cols-1 gap-4'}>
            {filteredAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} variant={viewMode} />
            ))}
          </div>
        ) : (

          <EmptyState
            icon={Gavel}
            title="No Auctions Found"
            description="There are no auctions matching your search criteria. Try modifying your filters or search term."
            actionText="Reset All Filters"
            onAction={() =>
              setFilterOptions({
                search: '',
                category: 'all',
                status: 'all',
                sortBy: 'ending_soonest',
              })
            }
          />
        )}
      </div>
    </div>
  );
};

