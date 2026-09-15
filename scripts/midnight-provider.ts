import { WalletBuilder } from '@midnight-ntwrk/wallet';
import * as zswap from '@midnight-ntwrk/zswap';
import { mnemonicToSeedSync } from 'bip39';
import { Logger } from 'pino';

export async function getMidnightProvider(walletSeed: string, logger: Logger): Promise<any> {
  const indexerUri = process.env.VITE_MIDNIGHT_INDEXER_URL || 'https://indexer.preview.midnight.network/api/v1/graphql';
  const indexerWsUri = process.env.VITE_MIDNIGHT_INDEXER_WS_URL || 'wss://indexer.preview.midnight.network/api/v1/graphql/ws';
  const proofServerUri = process.env.VITE_MIDNIGHT_PROOF_SERVER_URL || 'http://localhost:6300';
  const nodeUri = process.env.VITE_MIDNIGHT_NODE_URL || 'https://rpc.preview.midnight.network';

  logger.info(`Connecting to Indexer: ${indexerUri}`);

  logger.info('Deriving cryptographic seed from 12/24-word Mnemonic...');
  const seedBuffer = mnemonicToSeedSync(walletSeed.trim());
  const seedHex = seedBuffer.toString('hex');

  logger.info('Initializing Midnight WalletBuilder...');
  const wallet = await WalletBuilder.build(
    indexerUri,
    indexerWsUri,
    proofServerUri,
    nodeUri,
    seedHex,
    zswap.NetworkId.TestNet,
    'info'
  );

  logger.info(`✅ Wallet initialized! Public Key: ${(wallet as any).address || 'ready'}`);
  return wallet;
}
