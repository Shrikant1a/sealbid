import { AuctionCategory } from '../types/auction';

export interface CategoryInfo {
  id: AuctionCategory;
  name: string;
  description: string;
  iconName: string;
  color: string;
}

export const AUCTION_CATEGORIES: CategoryInfo[] = [
  {
    id: 'digital-assets',
    name: 'Digital Assets',
    description: 'Confidential NFT collections, token allocations, and rare on-chain artifacts',
    iconName: 'Shield',
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30',
  },
  {
    id: 'defi-collateral',
    name: 'DeFi Collateral',
    description: 'Private liquidation bundles, yield vaults, and shielded liquidity tranches',
    iconName: 'Layers',
    color: 'from-indigo-500/20 to-violet-500/20 text-indigo-400 border-indigo-500/30',
  },
  {
    id: 'compute-credits',
    name: 'Compute Credits',
    description: 'Decentralized ZK-proof computing pools, GPU clusters, and node licenses',
    iconName: 'Cpu',
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
  },
  {
    id: 'intellectual-property',
    name: 'Private IP & Research',
    description: 'Zero-knowledge audited patents, proprietary algorithms, and datasets',
    iconName: 'FileKey',
    color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
  },
  {
    id: 'domain-names',
    name: 'Midnight Domains',
    description: 'Shielded handle namespaces and decentralized routing identifiers',
    iconName: 'Globe',
    color: 'from-sky-500/20 to-indigo-500/20 text-sky-400 border-sky-500/30',
  },
  {
    id: 'collectibles',
    name: 'Exclusive Collectibles',
    description: 'High-value confidential physical and digital hybrid memorabilia',
    iconName: 'Sparkles',
    color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30',
  },
];
