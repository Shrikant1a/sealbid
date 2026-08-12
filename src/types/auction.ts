export type AuctionStatus = 
  | 'active' 
  | 'closing_soon' 
  | 'pending_reveal' 
  | 'ended'
  | 'completed' 
  | 'cancelled';

export type BidStatus = 
  | 'sealed' 
  | 'revealed' 
  | 'won' 
  | 'lost' 
  | 'settled';

export type AuctionCategory = 
  | 'digital-assets' 
  | 'defi-collateral' 
  | 'collectibles' 
  | 'domain-names' 
  | 'compute-credits' 
  | 'intellectual-property';

export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: AuctionCategory;
  sellerAddress: string;
  sellerName?: string;
  startingBidTDU: number;
  reservePriceTDU?: number;
  bidderCount: number;
  startTime: number; // Unix timestamp in ms
  endTime: number; // Unix timestamp in ms
  status: AuctionStatus;
  contractAddress: string;
  winnerAddress?: string;
  winningBidTDU?: number;
  winnerCommitmentHash?: string;
  isUserSeller?: boolean;
  zkProofHash?: string;
  verificationTimestamp?: number;
  isPreprodVerified?: boolean;
  minBidIncrementTDU?: number;
}

export interface PrivateBid {
  id: string;
  auctionId: string;
  auctionTitle: string;
  bidderAddress: string;
  bidAmountTDU: number; // Stored securely/locally for the bidder only; NEVER shared or broadcasted in plaintext
  commitmentHash: string; // Zero-knowledge cryptographic commitment hash (Hash(bidAmount || salt || bidderAddress))
  salt: string; // Private witness randomness
  submittedAt: number;
  status: BidStatus;
  txHash?: string;
  isWinner?: boolean;
  proofGenerated: boolean;
  midnightReceiptId?: string;
}

export interface ZKVerificationProof {
  auctionId: string;
  contractAddress: string;
  winnerCommitment: string;
  winnerAddress: string;
  winningBidTDU?: number;
  proofType: 'Compact_Groth16' | 'Midnight_Halo2_ZK';
  circuitName: 'SealedBidAuctionVerifier';
  verifierContract: string;
  verifiedAt: number;
  publicInputs: {
    auctionId: string;
    merkleRootOfCommitments: string;
    highestBidCommitment: string;
    auctionEndTime: number;
  };
  proofPayload: string;
  verificationStatus: 'verified' | 'pending' | 'failed';
  unrevealedLosingBidsCount: number;
}

export interface AuctionFilterOptions {
  search: string;
  category: string;
  status: string;
  sortBy: 'ending_soonest' | 'newest' | 'highest_starting' | 'lowest_starting' | 'most_bidders';
}
