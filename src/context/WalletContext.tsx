import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { MidnightAccount, WalletConnectionStatus, TransactionState, MidnightNetwork } from '../types/wallet';
import { midnightWalletConnector } from '../lib/midnight/wallet-connector';
import { MIDNIGHT_CONFIG, MIDNIGHT_NETWORKS } from '../lib/midnight/config';
import { useToast } from './ToastContext';

interface WalletContextType {
  account: MidnightAccount | null;
  status: WalletConnectionStatus;
  network: MidnightNetwork;
  setNetwork: (network: MidnightNetwork) => void;
  networkConfig: { label: string; indexer: string; explorer: string };
  isLaceAvailable: boolean;
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: (open: boolean) => void;
  txState: TransactionState | null;
  setTxState: React.Dispatch<React.SetStateAction<TransactionState | null>>;
  connectLace: (networkId?: string) => Promise<void>;
  connectPreview: () => void;
  disconnect: () => void;
  checkLace: () => boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<MidnightAccount | null>(midnightWalletConnector.getAccount());
  const [status, setStatus] = useState<WalletConnectionStatus>(midnightWalletConnector.getStatus());
  const [network, setNetworkState] = useState<MidnightNetwork>(
    account?.network || (MIDNIGHT_CONFIG.networkId as MidnightNetwork) || 'Preview'
  );
  const [isLaceAvailable, setIsLaceAvailable] = useState<boolean>(midnightWalletConnector.isLaceExtensionInstalled());
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [txState, setTxState] = useState<TransactionState | null>(null);
  const { showToast } = useToast();

  const setNetwork = useCallback((net: MidnightNetwork) => {
    setNetworkState(net);
    if (account) {
      const updated = { ...account, network: net };
      setAccount(updated);
    }
  }, [account]);

  const checkLace = useCallback(() => {
    const available = midnightWalletConnector.isLaceExtensionInstalled();
    setIsLaceAvailable(available);
    return available;
  }, []);

  useEffect(() => {
    // Initial check
    checkLace();

    // Subscribe to connector state changes
    const unsubscribe = midnightWalletConnector.subscribe((acc, stat) => {
      setAccount(acc);
      setStatus(stat);
      if (acc?.network) {
        setNetworkState(acc.network);
      }
      checkLace();
    });

    // Continuous poll for extension injection and network state
    const interval = setInterval(async () => {
      checkLace();
      // If connected to Lace, check if network changed in Lace extension
      const api = midnightWalletConnector.getConnectedAPI();
      if (api && typeof api.getConfiguration === 'function') {
        try {
          const cfg = await api.getConfiguration();
          if (cfg?.networkId) {
            const detectedNet = (cfg.networkId.charAt(0).toUpperCase() + cfg.networkId.slice(1)) as MidnightNetwork;
            if (detectedNet && detectedNet !== network) {
              setNetworkState(detectedNet);
              if (account && account.network !== detectedNet) {
                setAccount({ ...account, network: detectedNet });
              }
            }
          }
        } catch {
          // ignore
        }
      }
    }, 800);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [checkLace, network, account]);

  const connectLace = useCallback(async (networkId?: string) => {
    try {
      setStatus('connecting');
      const targetNet = networkId || network.toLowerCase();
      const acc = await midnightWalletConnector.connectLace(targetNet);
      setAccount(acc);
      setNetworkState(acc.network);
      setStatus('connected');
      setIsWalletModalOpen(false);
      showToast('success', 'Midnight Lace Connected', `Connected account on Midnight ${acc.network}: ${acc.address.slice(0, 8)}...`);
    } catch (err: any) {
      setStatus('error');
      showToast('error', 'Connection Notice', err.message || 'Could not connect to Midnight Lace extension.');
      throw err;
    }
  }, [network, showToast]);

  const connectPreview = useCallback(() => {
    const acc = midnightWalletConnector.createPreviewSession();
    acc.network = network;
    setAccount(acc);
    setStatus('connected');
    setIsWalletModalOpen(false);
    showToast('info', 'Preview Session Active', `Using preview wallet on Midnight ${network}.`);
  }, [network, showToast]);

  const disconnect = useCallback(() => {
    midnightWalletConnector.disconnect();
    setAccount(null);
    setStatus('disconnected');
    showToast('info', 'Wallet Disconnected', 'Your wallet has been disconnected.');
  }, [showToast]);

  const networkKey = (network || 'preview').toLowerCase();
  const networkConfig = MIDNIGHT_NETWORKS[networkKey] || {
    label: `Midnight ${network}`,
    indexer: 'https://indexer.preview.midnight.network/api/v1/graphql',
    explorer: `https://explorer.${networkKey}.midnight.network`,
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        status,
        network,
        setNetwork,
        networkConfig,
        isLaceAvailable,
        isWalletModalOpen,
        setIsWalletModalOpen,
        txState,
        setTxState,
        connectLace,
        connectPreview,
        disconnect,
        checkLace,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
