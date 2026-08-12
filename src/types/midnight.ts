import { MidnightNetwork } from './wallet';

/**
 * Midnight Network Connection Configuration
 */
export interface MidnightNetworkConfig {
  networkId: MidnightNetwork;
  indexerUrl: string;
  indexerWsUrl: string;
  proofServerUrl: string;
  explorerUrl: string;
  contractAddress?: string;
}

/**
 * Compact Smart Contract State Interface
 * Represents the on-chain ledger state for the SealedBidAuction contract
 */
export interface CompactAuctionLedgerState {
  auctionId: string;
  sellerPk: string;
  startingPrice: bigint;
  endTime: bigint;
  commitmentsCount: number;
  commitmentsRoot: string;
  isClosed: boolean;
  winnerPk?: string;
  winnerCommitment?: string;
}

/**
 * Interface definition for Compact Smart Contract Interactions
 * To be implemented against the generated TypeScript bindings from `compact compile`
 */
export interface ISealedBidAuctionContract {
  createAuction(params: {
    title: string;
    startingPrice: bigint;
    durationSeconds: bigint;
  }): Promise<{ txHash: string; contractAddress: string }>;

  submitPrivateBid(params: {
    auctionContractAddress: string;
    bidAmount: bigint;
    salt: string;
  }): Promise<{ txHash: string; commitmentHash: string; proof: string }>;

  settleAndVerifyWinner(params: {
    auctionContractAddress: string;
    revealedHighestBid: bigint;
    winnerSalt: string;
    winnerPk: string;
  }): Promise<{ txHash: string; winnerAddress: string; zkProof: string }>;

  getAuctionState(contractAddress: string): Promise<CompactAuctionLedgerState>;
}
