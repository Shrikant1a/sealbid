import { MidnightNetwork } from '../../types/wallet';

export interface MidnightNetworkConfig {
  networkId: MidnightNetwork;
  indexerUrl: string;
  indexerWsUrl: string;
  proofServerUrl: string;
  explorerUrl: string;
  contractAddress?: string;
}

export const MIDNIGHT_NETWORKS: Record<string, { label: string; indexer: string; explorer: string; id: MidnightNetwork }> = {
  preview: {
    id: 'Preview',
    label: 'Midnight Preview',
    indexer: 'https://indexer.preview.midnight.network/api/v1/graphql',
    explorer: 'https://explorer.preview.midnight.network',
  },
  preprod: {
    id: 'Preprod',
    label: 'Midnight Preprod',
    indexer: 'https://indexer.preprod.midnight.network/api/v1/graphql',
    explorer: 'https://explorer.preprod.midnight.network',
  },
  testnet: {
    id: 'Testnet',
    label: 'Midnight Testnet',
    indexer: 'https://indexer.testnet.midnight.network/api/v1/graphql',
    explorer: 'https://explorer.testnet.midnight.network',
  },
  devnet: {
    id: 'Devnet',
    label: 'Midnight Devnet',
    indexer: 'http://localhost:8088/api/v1/graphql',
    explorer: 'https://explorer.devnet.midnight.network',
  },
  undeployed: {
    id: 'Undeployed',
    label: 'Midnight Undeployed (Local)',
    indexer: 'http://localhost:8088/api/v1/graphql',
    explorer: 'https://explorer.midnight.network',
  },
};

const initialNetworkId = (import.meta.env.VITE_MIDNIGHT_NETWORK_ID as MidnightNetwork) || 'Preprod';
const networkKey = initialNetworkId.toLowerCase();
const networkPreset = MIDNIGHT_NETWORKS[networkKey] || MIDNIGHT_NETWORKS.preview;

export const MIDNIGHT_CONFIG: MidnightNetworkConfig = {
  networkId: networkPreset.id,
  indexerUrl: import.meta.env.VITE_MIDNIGHT_INDEXER_URL || networkPreset.indexer,
  indexerWsUrl: import.meta.env.VITE_MIDNIGHT_INDEXER_WS_URL || networkPreset.indexer.replace('https://', 'wss://').replace('http://', 'ws://') + '/ws',
  proofServerUrl: import.meta.env.VITE_MIDNIGHT_PROOF_SERVER_URL || 'http://localhost:6300',
  explorerUrl: import.meta.env.VITE_MIDNIGHT_EXPLORER_URL || networkPreset.explorer,
  contractAddress: import.meta.env.VITE_SEALBID_CONTRACT_ADDRESS || undefined,
};

export const IS_DEMO_MODE = import.meta.env.VITE_DEMO_DATA_ENABLED !== 'false';
