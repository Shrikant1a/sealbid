import { WalletBuilder } from '@midnight-ntwrk/wallet';
import { mnemonicToSeedSync } from 'bip39';
import { Logger } from 'pino';

export async function getMidnightProvider(walletSeed: string, logger: Logger): Promise<MidnightProviders> {
  const indexerUri = process.env.VITE_MIDNIGHT_INDEXER_URL || 'https://indexer.preview.midnight.network/api/v1/graphql';
  const indexerWsUri = process.env.VITE_MIDNIGHT_INDEXER_WS_URL || 'wss://indexer.preview.midnight.network/api/v1/graphql/ws';
  const proofServerUri = process.env.VITE_MIDNIGHT_PROOF_SERVER_URL || 'http://localhost:6300';

  logger.info(`Connecting to Indexer: ${indexerUri}`);

  logger.info('Deriving cryptographic seed from 24-word Mnemonic...');
  const seedBytes = mnemonicToSeedSync(walletSeed);
  const seed = new Uint8Array(seedBytes).slice(0, 32); // Midnight requires 32-byte seed

  logger.info('Initializing WalletBuilder...');
  const wallet = await WalletBuilder.buildFromSeed(
    seed,
    indexerUri,
    indexerWsUri,
    proofServerUri,
    'Preview'
  );

  logger.info(`✅ Wallet initialized! Public Key: ${wallet.address}`);

  return wallet as unknown as any; // Cast as MidnightProviders
}
