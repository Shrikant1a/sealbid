import pino from 'pino';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { CompactRuntime } from '@midnight-ntwrk/compact-runtime';
import { MidnightProviders, contracts } from '@midnight-ntwrk/midnight-js';
const { deployContract } = contracts;
import { getMidnightProvider } from './midnight-provider.js'; // We will create this helper
import { Contract } from '../managed/contract/index.js'; // Compiled contract bindings

dotenv.config({ path: resolve(process.cwd(), '.env.deploy') });

const logger = pino({ level: 'info' });

async function main() {
  logger.info('Starting Sealed Bid Auction Deployment on Midnight Preview Testnet...');

  const walletSeed = process.env.WALLET_SEED;
  if (!walletSeed) {
    throw new Error('WALLET_SEED is required in .env.deploy');
  }

  // 1. Initialize Midnight Provider (Indexer + Proof Server + Wallet)
  logger.info('Initializing Midnight providers...');
  const providers = await getMidnightProvider(walletSeed, logger);

  // 2. Load Contract Metadata
  logger.info('Loading compiled Compact contract...');
  // The contract bindings from 'managed/contract' provide the necessary initialization parameters.
  
  // 3. Deploy the Contract
  logger.info('Broadcasting deployment transaction to Midnight network...');
  
  // We specify initial ledger state parameters required by the contract.
  // In `sealed_bid_auction.compact`, it exports seller, startingBid, reservePrice, etc.
  const initialLedgerState = {
      seller: providers.walletProvider.address,
      startingBid: 5000n,
      reservePrice: 10000n,
      endTime: BigInt(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      bidderCount: 0n,
      isClosed: false,
      highestBidCommitment: new Uint8Array(32),
      winnerAddress: new Uint8Array(32),
      winningBidAmount: 0n,
      commitmentsTreeRoot: new Uint8Array(32),
  };

  try {
    const deployment = await deployContract(providers, {
      privateState: {}, // No private state for this contract initialization
      contract: Contract,
      initialState: initialLedgerState,
    });

    logger.info(`✅ Contract successfully deployed!`);
    logger.info(`📜 Contract Address: ${deployment.contractAddress}`);
    
    // Suggest next steps to user
    logger.info('\n--- NEXT STEPS ---');
    logger.info(`1. Copy the Contract Address above.`);
    logger.info(`2. Paste it into your main .env file as VITE_SEALBID_CONTRACT_ADDRESS=${deployment.contractAddress}`);
    logger.info(`3. Commit your changes and submit to Rise In.`);
    
  } catch (err: any) {
    logger.error(`Deployment failed: ${err.message}`);
    process.exit(1);
  }
}

main().catch(console.error);
