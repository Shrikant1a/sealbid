import React from 'react';
import { AuctionFilterOptions } from '../../types/auction';
import { AUCTION_CATEGORIES } from '../../data/categories';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface AuctionFilterProps {
  filters: AuctionFilterOptions;
  onChange: (filters: AuctionFilterOptions) => void;
  totalCount: number;
}

export const AuctionFilter: React.FC<AuctionFilterProps> = ({
  filters,
  onChange,
  totalCount,
}) => {
  const statusOptions = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Closing Soon', value: 'closing_soon' },
    { label: 'Auction Complete', value: 'completed' },
  ];

  const sortOptions = [
    { label: 'Ending Soonest', value: 'ending_soonest' },
    { label: 'Newest Listed', value: 'newest' },
    { label: 'Highest Starting Bid', value: 'highest_starting' },
    { label: 'Lowest Starting Bid', value: 'lowest_starting' },
    { label: 'Most Sealed Bids', value: 'most_bidders' },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value });
  };

  const handleCategoryClick = (catId: string) => {
    onChange({ ...filters, category: filters.category === catId ? 'all' : catId });
  };

  const handleStatusChange = (status: string) => {
    onChange({ ...filters, status });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, sortBy: e.target.value as any });
  };

  const hasActiveFilters = filters.search || filters.category !== 'all' || filters.status !== 'all';

  return (
    <div className="space-y-4 mb-8">
      {/* Top Search & Sort Row */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search private auctions by title, category, or keyword..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status & Sort Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Select */}
          <div className="flex items-center bg-midnight-900/90 border border-midnight-700/70 rounded-xl p-1">
            {statusOptions.map((st) => (
              <button
                key={st.value}
                onClick={() => handleStatusChange(st.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filters.status === st.value
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="appearance-none bg-midnight-900 border border-midnight-700/70 rounded-xl px-3.5 py-2 pr-8 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-midnight-900 text-white">
                  Sort: {opt.label}
                </option>
              ))}
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => onChange({ ...filters, category: 'all' })}
          className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
            filters.category === 'all'
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
              : 'bg-midnight-900/60 text-slate-400 border border-midnight-800 hover:text-white hover:border-slate-700'
          }`}
        >
          All Categories ({totalCount})
        </button>

        {AUCTION_CATEGORIES.map((cat) => {
          const isSelected = filters.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'bg-midnight-900/60 text-slate-400 border border-midnight-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat.name}
            </button>
          );
        })}

        {hasActiveFilters && (
          <button
            onClick={() =>
              onChange({
                search: '',
                category: 'all',
                status: 'all',
                sortBy: 'ending_soonest',
              })
            }
            className="shrink-0 text-xs text-red-400 hover:text-red-300 underline ml-2"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};
