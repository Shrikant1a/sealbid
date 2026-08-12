export type MidnightNetwork = 'Preview' | 'Preprod' | 'Testnet' | 'Devnet' | 'Undeployed' | 'Local';

export type WalletConnectionStatus = 
  | 'disconnected' 
  | 'connecting' 
  | 'connected' 
  | 'error';

export interface MidnightAccount {
  address: string;
  shieldedAddress: string;
  balanceTDU: number;
  network: MidnightNetwork;
  isLaceConnected: boolean;
}

export type TxStep = 
  | 'idle' 
  | 'generating_proof' 
  | 'requesting_signature' 
  | 'submitting_to_network' 
  | 'submitting_to_preprod' 
  | 'confirmed' 
  | 'failed';

export interface TransactionState {
  id: string;
  type: 'submit_bid' | 'create_auction' | 'close_auction' | 'reveal_winner';
  status: TxStep;
  title: string;
  stepDescription: string;
  txHash?: string;
  proofHash?: string;
  error?: string;
  timestamp: number;
}
