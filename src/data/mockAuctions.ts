import { AuctionItem, PrivateBid, ZKVerificationProof } from '../types/auction';

/**
 * ============================================================================
 * DEMO AUCTION DATASET FOR UI PREVIEW & VERIFICATION TESTING
 * ============================================================================
 * 
 * Note: When connected to a live Midnight Preprod network, this dataset will be 
 * populated directly from the Midnight GraphQL Indexer and the Compact contract ledger.
 */

const ONE_HOUR = 3600 * 1000;
const ONE_DAY = 24 * ONE_HOUR;
const NOW = Date.now();

export const INITIAL_MOCK_AUCTIONS: AuctionItem[] = [
  {
    id: 'auction-001',
    title: 'Midnight Genesis Validator License #042',
    description: 'Exclusive tier-1 perpetual validator node operating rights on Midnight Preprod with zero-knowledge governance delegation capabilities and shielded staking reward distribution.',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
    category: 'compute-credits',
    sellerAddress: 'midnight1q9k7j2x4f6h8a0s3d5g7j9l2c4v6b8n0m1',
    sellerName: 'Midnight Foundation Guild',
    startingBidTDU: 5000,
    reservePriceTDU: 12000,
    bidderCount: 14,
    startTime: NOW - 2 * ONE_DAY,
    endTime: NOW + 18 * ONE_HOUR, // Closing soon
    status: 'closing_soon',
    contractAddress: 'midnight1contract_genesis_val_042',
    minBidIncrementTDU: 250,
    isPreprodVerified: true,
  },
  {
    id: 'auction-002',
    title: 'Shielded DeFi Liquidity Vault: Epoch-7 Tranche',
    description: 'Private structured lending allocation backed by multi-collateral Cardano and Midnight wrapped assets. All historical performance data is verified via Compact ZK circuits.',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    category: 'defi-collateral',
    sellerAddress: 'midnight1qz8u9i0o1p2a3s4d5f6g7h8j9k0l1z2x3c4',
    sellerName: 'Nocturne Private Yield Syndicate',
    startingBidTDU: 15000,
    reservePriceTDU: 30000,
    bidderCount: 8,
    startTime: NOW - 1 * ONE_DAY,
    endTime: NOW + 3 * ONE_DAY,
    status: 'active',
    contractAddress: 'midnight1contract_vault_epoch7',
    minBidIncrementTDU: 500,
    isPreprodVerified: true,
  },
  {
    id: 'auction-003',
    title: 'Zero-Knowledge Proof Acceleration Algorithm IP',
    description: 'Proprietary recursive SNARK prover optimization reducing browser-side proof generation latency by 45%. Includes full verification benchmark suite and commercial rights transfer.',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    category: 'intellectual-property',
    sellerAddress: 'midnight1qpv6w8e9r2t4y5u7i8o9p0a1s2d3f4g5h6j7k8', // Current user demo seller
    sellerName: 'You (Connected Wallet)',
    startingBidTDU: 8500,
    reservePriceTDU: 18000,
    bidderCount: 19,
    startTime: NOW - 4 * ONE_DAY,
    endTime: NOW + 2 * ONE_DAY,
    status: 'active',
    contractAddress: 'midnight1contract_zk_algo_ip_003',
    isUserSeller: true,
    minBidIncrementTDU: 500,
    isPreprodVerified: true,
  },
  {
    id: 'auction-004',
    title: 'Midnight Name Service: "privacy.mid"',
    description: 'Premier single-word shielded top-level domain identifier for Midnight Network. Supports confidential sub-address resolution, zero-knowledge metadata binding, and anonymous messaging.',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    category: 'domain-names',
    sellerAddress: 'midnight1q9a8s7d6f5g4h3j2k1l0z9x8c7v6b5n4m3',
    sellerName: 'Midnight Registrar DAO',
    startingBidTDU: 2500,
    reservePriceTDU: 7500,
    bidderCount: 27,
    startTime: NOW - 5 * ONE_DAY,
    endTime: NOW + 6 * ONE_HOUR, // Closing very soon
    status: 'closing_soon',
    contractAddress: 'midnight1contract_mns_privacy_mid',
    minBidIncrementTDU: 100,
    isPreprodVerified: true,
  },
  {
    id: 'auction-005',
    title: 'Autonomous Confidential AI Prover Node Cluster',
    description: 'Dedicated 8x H100 GPU computing allocation reserved exclusively for generating Midnight Halo2 and Groth16 zero-knowledge proofs with verifiable enclave attestation.',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    category: 'compute-credits',
    sellerAddress: 'midnight1qm2n3b4v5c6x7z8l9k0j1h2g3f4d5s6a7',
    sellerName: 'Hyperion Compute Network',
    startingBidTDU: 12000,
    reservePriceTDU: 25000,
    bidderCount: 11,
    startTime: NOW - 3 * ONE_DAY,
    endTime: NOW + 4 * ONE_DAY,
    status: 'active',
    contractAddress: 'midnight1contract_cluster_h100',
    minBidIncrementTDU: 500,
    isPreprodVerified: true,
  },
  {
    id: 'auction-006',
    title: 'Historical Midnight Testnet Artifact: Block #0001',
    description: 'Cryptographically sealed genesis commemorative artifact from Midnight Devnet launch. Fully verifiable with zk-SNARK provenance certificate.',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    category: 'collectibles',
    sellerAddress: 'midnight1qa1s2d3f4g5h6j7k8l9z0x1c2v3b4n5m6',
    sellerName: 'Midnight Pioneers Guild',
    startingBidTDU: 3200,
    reservePriceTDU: 6000,
    bidderCount: 31,
    startTime: NOW - 7 * ONE_DAY,
    endTime: NOW - 3 * ONE_HOUR, // Closed auction
    status: 'completed',
    contractAddress: 'midnight1contract_artifact_0001',
    winnerAddress: 'midnight1q8w7e6r5t4y3u2i1o0p9a8s7d6f5g4h3j2',
    winningBidTDU: 9450,
    winnerCommitmentHash: '0xzk_commit_9450_98ab76cd43ef210987654321',
    zkProofHash: '0xzkproof_verified_groth16_finality_block0001',
    verificationTimestamp: NOW - 2 * ONE_HOUR,
    minBidIncrementTDU: 200,
    isPreprodVerified: true,
  },
  {
    id: 'auction-007',
    title: 'Confidential Carbon Offset Credit Batch (10,000 MT)',
    description: 'Verified environmental offset credits with private corporate retirement certificates generated using Midnight confidential state transitions.',
    imageUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80',
    category: 'digital-assets',
    sellerAddress: 'midnight1q3f4g5h6j7k8l9z0x1c2v3b4n5m6a7s8d',
    sellerName: 'Verdant Carbon Ledger',
    startingBidTDU: 6500,
    reservePriceTDU: 14000,
    bidderCount: 9,
    startTime: NOW - 2 * ONE_DAY,
    endTime: NOW + 5 * ONE_DAY,
    status: 'active',
    contractAddress: 'midnight1contract_carbon_batch_72',
    minBidIncrementTDU: 250,
    isPreprodVerified: true,
  },
  {
    id: 'auction-008',
    title: 'Shielded Algorithm Vault: MEV Protection Engine',
    description: 'Smart order routing engine with zero-knowledge sandwich protection for multi-chain DEX swaps across Cardano and Midnight bridges.',
    imageUrl: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80',
    category: 'intellectual-property',
    sellerAddress: 'midnight1qpv6w8e9r2t4y5u7i8o9p0a1s2d3f4g5h6j7k8', // User demo seller
    sellerName: 'You (Connected Wallet)',
    startingBidTDU: 9000,
    reservePriceTDU: 20000,
    bidderCount: 16,
    startTime: NOW - 6 * ONE_DAY,
    endTime: NOW - 1 * ONE_DAY, // Closed auction
    status: 'completed',
    contractAddress: 'midnight1contract_mev_shield_vault',
    winnerAddress: 'midnight1q9k7j2x4f6h8a0s3d5g7j9l2c4v6b8n0m1',
    winningBidTDU: 17800,
    winnerCommitmentHash: '0xzk_commit_17800_77ca43bf89ea129012345678',
    zkProofHash: '0xzkproof_verified_groth16_finality_mev_008',
    verificationTimestamp: NOW - 22 * ONE_HOUR,
    isUserSeller: true,
    minBidIncrementTDU: 500,
    isPreprodVerified: true,
  }
];

export const INITIAL_USER_BIDS: PrivateBid[] = [
  {
    id: 'bid-user-001',
    auctionId: 'auction-001',
    auctionTitle: 'Midnight Genesis Validator License #042',
    bidderAddress: 'midnight1qpv6w8e9r2t4y5u7i8o9p0a1s2d3f4g5h6j7k8',
    bidAmountTDU: 8250, // Only visible locally to the bidder
    commitmentHash: '0xzk_b8c9d0e1f2a3456789abcdef0123456789abcdef0123456789abcdef01234567',
    salt: '7a8f9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
    submittedAt: NOW - 12 * ONE_HOUR,
    status: 'sealed',
    txHash: '0x99887766554433221100aabbccddeeff99887766554433221100aabbccddeeff',
    proofGenerated: true,
    midnightReceiptId: 'SEAL-REC-001-9482',
  },
  {
    id: 'bid-user-006',
    auctionId: 'auction-006',
    auctionTitle: 'Historical Midnight Testnet Artifact: Block #0001',
    bidderAddress: 'midnight1qpv6w8e9r2t4y5u7i8o9p0a1s2d3f4g5h6j7k8',
    bidAmountTDU: 7100, // Losing bid
    commitmentHash: '0xzk_11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff',
    salt: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    submittedAt: NOW - 4 * ONE_DAY,
    status: 'lost', // Completed auction where user lost, but their 7100 tDU was never revealed publicly
    txHash: '0xaa11bb22cc33dd44ee55ff6600778899aa11bb22cc33dd44ee55ff6600778899',
    proofGenerated: true,
    midnightReceiptId: 'SEAL-REC-006-2018',
  }
];

export const MOCK_VERIFICATION_PROOFS: Record<string, ZKVerificationProof> = {
  'auction-006': {
    auctionId: 'auction-006',
    contractAddress: 'midnight1contract_artifact_0001',
    winnerCommitment: '0xzk_commit_9450_98ab76cd43ef210987654321',
    winnerAddress: 'midnight1q8w7e6r5t4y3u2i1o0p9a8s7d6f5g4h3j2',
    winningBidTDU: 9450,
    proofType: 'Compact_Groth16',
    circuitName: 'SealedBidAuctionVerifier',
    verifierContract: 'midnight1verifier_sealed_auction_v1',
    verifiedAt: NOW - 2 * ONE_HOUR,
    publicInputs: {
      auctionId: 'auction-006',
      merkleRootOfCommitments: '0x9923847291837491823749817293847192837491827394817293847192837491',
      highestBidCommitment: '0xzk_commit_9450_98ab76cd43ef210987654321',
      auctionEndTime: NOW - 3 * ONE_HOUR,
    },
    proofPayload: '0x12a0f889c0918e77b1029384019283019283019283019283019283019283019283019283',
    verificationStatus: 'verified',
    unrevealedLosingBidsCount: 30,
  },
  'auction-008': {
    auctionId: 'auction-008',
    contractAddress: 'midnight1contract_mev_shield_vault',
    winnerCommitment: '0xzk_commit_17800_77ca43bf89ea129012345678',
    winnerAddress: 'midnight1q9k7j2x4f6h8a0s3d5g7j9l2c4v6b8n0m1',
    winningBidTDU: 17800,
    proofType: 'Compact_Groth16',
    circuitName: 'SealedBidAuctionVerifier',
    verifierContract: 'midnight1verifier_sealed_auction_v1',
    verifiedAt: NOW - 22 * ONE_HOUR,
    publicInputs: {
      auctionId: 'auction-008',
      merkleRootOfCommitments: '0x1829384719283749182739481729384719283749182739481729384719283749',
      highestBidCommitment: '0xzk_commit_17800_77ca43bf89ea129012345678',
      auctionEndTime: NOW - 1 * ONE_DAY,
    },
    proofPayload: '0x99b102938401928301928301928301928301928301928301928301928301928312a0f8',
    verificationStatus: 'verified',
    unrevealedLosingBidsCount: 15,
  }
};
