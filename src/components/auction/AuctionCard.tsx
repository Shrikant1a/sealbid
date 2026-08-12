import React from 'react';
import { Link } from 'react-router-dom';
import { AuctionItem } from '../../types/auction';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { PrivacyBadge } from '../common/PrivacyBadge';
import { CountdownTimer } from '../common/CountdownTimer';
import { Button } from '../common/Button';
import { formatTDU, formatAddress } from '../../lib/utils';
import { Users, Lock, ArrowRight, Sparkles } from 'lucide-react';

export const AuctionCard: React.FC<{
  auction: AuctionItem;
  onQuickBid?: (auction: AuctionItem) => void;
}> = ({ auction }) => {
  const isCompleted = auction.status === 'completed';
  const isEnded = isCompleted || auction.status === 'ended' || Date.now() >= auction.endTime;

  return (
    <Card
      variant="glass"
      hoverEffect
      className="flex flex-col h-full p-0 overflow-hidden group border-midnight-700/60 hover:border-cyan-500/50"
    >
      {/* Image & Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-midnight-950">
        <img
          src={auction.imageUrl}
          alt={auction.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1020] via-transparent to-black/40" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <Badge status={auction.status} endTime={auction.endTime} size="sm" />
          <PrivacyBadge type={isCompleted ? 'winner-verified' : 'private-bid'} size="sm" />
        </div>

        {/* Bottom image overlay countdown */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-midnight-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-midnight-700/60 font-medium">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>{auction.bidderCount} Sealed Bids</span>
          </div>

          {!isCompleted && (
            <CountdownTimer endTime={auction.endTime} variant="pill" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
              {auction.category.replace('-', ' ')}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] text-slate-400 font-mono">
              {formatAddress(auction.sellerAddress, 4, 3)}
            </span>
          </div>

          <Link
            to={`/auction/${auction.id}`}
            className="block group-hover:text-cyan-300 transition-colors"
          >
            <h3 className="text-base font-bold text-white line-clamp-1 group-hover:underline decoration-cyan-400/50 underline-offset-4">
              {auction.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            {auction.description}
          </p>
        </div>

        {/* Pricing / Bid Info */}
        <div className="pt-3 border-t border-midnight-750/80">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">
                {isCompleted ? 'Winning Final Bid' : 'Starting Reserve'}
              </span>
              <span className="text-sm font-bold text-white font-mono">
                {formatTDU(isCompleted ? auction.winningBidTDU : auction.startingBidTDU)}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-medium">
                Bid Privacy
              </span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 justify-end">
                <Lock className="w-3 h-3" />
                100% Confidential
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <Link to={`/auction/${auction.id}`} className="flex-1">
              <Button
                variant={isCompleted ? 'secondary' : isEnded ? 'primary' : 'primary'}
                size="sm"
                className="w-full"
                rightIcon={isEnded && !isCompleted ? <Sparkles className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              >
                {isCompleted ? 'View Results & Proof' : isEnded ? 'Settle & Reveal Winner' : 'Place Private Bid'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};
