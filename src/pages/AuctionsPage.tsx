import React from 'react';
import { useAuctions } from '../context/AuctionContext';
import { AuctionCard } from '../components/auction/AuctionCard';
import { AuctionFilter } from '../components/auction/AuctionFilter';
import { EmptyState } from '../components/common/LoadingSpinner';
import { Gavel, Lock } from 'lucide-react';
import { formatTDU } from '../lib/utils';

export const AuctionsPage: React.FC = () => {
  const { filteredAuctions, auctions, filterOptions, setFilterOptions } = useAuctions();

  // Compute marketplace stats
  const activeCount = auctions.filter((a) => a.status === 'active' || a.status === 'closing_soon').length;
  const totalBids = auctions.reduce((acc, a) => acc + a.bidderCount, 0);
  const totalVolumeTDU = auctions.reduce((acc, a) => acc + (a.winningBidTDU || a.startingBidTDU), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-midnight-750">
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
        <div className="flex items-center gap-3 bg-midnight-900/80 border border-midnight-750 p-2.5 rounded-2xl">
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

      {/* Filter and Search controls */}
      <AuctionFilter
        filters={filterOptions}
        onChange={setFilterOptions}
        totalCount={auctions.length}
      />

      {/* Auction Cards Grid */}
      {filteredAuctions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
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
  );
};
