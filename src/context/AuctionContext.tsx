import React, { createContext, useContext, useState, useMemo, useCallback, useEffect, ReactNode } from 'react';
import { AuctionItem, PrivateBid, ZKVerificationProof, AuctionFilterOptions } from '../types/auction';
import { INITIAL_MOCK_AUCTIONS, INITIAL_USER_BIDS, MOCK_VERIFICATION_PROOFS } from '../data/mockAuctions';
import { useWallet } from './WalletContext';
import { useToast } from './ToastContext';
import { computeCommitmentHash, generateRandomSalt } from '../lib/utils';
import { midnightProofService } from '../lib/midnight/proof-service';

interface AuctionContextType {
  auctions: AuctionItem[];
  userBids: PrivateBid[];
  userAuctions: AuctionItem[];
  filterOptions: AuctionFilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<AuctionFilterOptions>>;
  filteredAuctions: AuctionItem[];
  getAuctionById: (id: string) => AuctionItem | undefined;
  getVerificationProof: (auctionId: string) => ZKVerificationProof | undefined;
  getUserBidForAuction: (auctionId: string) => PrivateBid | undefined;
  submitPrivateBid: (auctionId: string, amountTDU: number) => Promise<PrivateBid>;
  createAuction: (params: {
    title: string;
    description: string;
    imageUrl: string;
    category: any;
    startingBidTDU: number;
    reservePriceTDU?: number;
    durationHours?: number;
    durationMinutes?: number;
  }) => Promise<AuctionItem>;
  settleAuction: (auctionId: string) => Promise<ZKVerificationProof>;
}

const safeGetJSON = <T,>(key: string, fallback: T): T => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const item = window.localStorage.getItem(key);
      if (item) return JSON.parse(item);
    } catch {
      // ignore parse error
    }
  }
  return fallback;
};

const safeSetJSON = (key: string, value: any): void => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore write error
    }
  }
};

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

export const AuctionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from persistent storage or default mocks
  const [auctions, setAuctions] = useState<AuctionItem[]>(() => {
    const saved = safeGetJSON<AuctionItem[]>('sealbid_auctions_ledger', []);
    if (saved && saved.length > 0) {
      const savedIds = new Set(saved.map((a) => a.id));
      const missingInitial = INITIAL_MOCK_AUCTIONS.filter((a) => !savedIds.has(a.id));
      return [...saved, ...missingInitial];
    }
    return INITIAL_MOCK_AUCTIONS;
  });

  const [userBids, setUserBids] = useState<PrivateBid[]>(() => {
    return safeGetJSON<PrivateBid[]>('sealbid_user_bids_ledger', INITIAL_USER_BIDS);
  });

  const [verificationProofs, setVerificationProofs] = useState<Record<string, ZKVerificationProof>>(() => {
    return safeGetJSON<Record<string, ZKVerificationProof>>('sealbid_proofs_ledger', MOCK_VERIFICATION_PROOFS);
  });
  
  const [filterOptions, setFilterOptions] = useState<AuctionFilterOptions>({
    search: '',
    category: 'all',
    status: 'all',
    sortBy: 'ending_soonest',
  });

  const { account, network, setTxState } = useWallet();
  const { showToast } = useToast();

  // Persist auctions state whenever it updates
  useEffect(() => {
    safeSetJSON('sealbid_auctions_ledger', auctions);
  }, [auctions]);

  // Persist user private bids state whenever it updates
  useEffect(() => {
    safeSetJSON('sealbid_user_bids_ledger', userBids);
  }, [userBids]);

  // Persist verification proofs state whenever it updates
  useEffect(() => {
    safeSetJSON('sealbid_proofs_ledger', verificationProofs);
  }, [verificationProofs]);

  const userAuctions = useMemo(() => {
    if (!account) return auctions.filter((a) => a.isUserSeller);
    return auctions.filter((a) => a.isUserSeller || a.sellerAddress.toLowerCase() === account.address.toLowerCase());
  }, [auctions, account]);

  const filteredAuctions = useMemo(() => {
    return auctions.filter((item) => {
      const isItemEnded = Date.now() >= item.endTime || item.status === 'completed';

      // Search
      if (filterOptions.search.trim()) {
        const query = filterOptions.search.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesCategory) return false;
      }

      // Category
      if (filterOptions.category !== 'all' && item.category !== filterOptions.category) {
        return false;
      }

      // Status
      if (filterOptions.status !== 'all') {
        if (filterOptions.status === 'active' && isItemEnded) return false;
        if (filterOptions.status === 'closing_soon' && item.status !== 'closing_soon') return false;
        if (filterOptions.status === 'completed' && !isItemEnded) return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filterOptions.sortBy) {
        case 'ending_soonest':
          if (a.status === 'completed' && b.status !== 'completed') return 1;
          if (b.status === 'completed' && a.status !== 'completed') return -1;
          return a.endTime - b.endTime;
        case 'newest':
          return b.startTime - a.startTime;
        case 'highest_starting':
          return b.startingBidTDU - a.startingBidTDU;
        case 'lowest_starting':
          return a.startingBidTDU - b.startingBidTDU;
        case 'most_bidders':
          return b.bidderCount - a.bidderCount;
        default:
          return 0;
      }
    });
  }, [auctions, filterOptions]);

  const getAuctionById = useCallback(
    (id: string) => auctions.find((a) => a.id === id),
    [auctions]
  );

  const getVerificationProof = useCallback(
    (auctionId: string) => verificationProofs[auctionId],
    [verificationProofs]
  );

  const getUserBidForAuction = useCallback(
    (auctionId: string) => userBids.find((b) => b.auctionId === auctionId),
    [userBids]
  );

  /**
   * Submit Private Sealed Bid workflow with Multi-phase ZK Proof tracking
   */
  const submitPrivateBid = useCallback(
    async (auctionId: string, amountTDU: number): Promise<PrivateBid> => {
      const targetAuction = auctions.find((a) => a.id === auctionId);
      if (!targetAuction) {
        throw new Error('Auction not found.');
      }
      if (Date.now() >= targetAuction.endTime || targetAuction.status === 'completed') {
        throw new Error('Auction has ended. Sealed bids are no longer accepted.');
      }
      if (!account) {
        throw new Error('Please connect your Midnight wallet first.');
      }
      if (amountTDU < targetAuction.startingBidTDU) {
        throw new Error(`Bid amount must be at least ${targetAuction.startingBidTDU} tDU.`);
      }

      const salt = generateRandomSalt();
      const commitmentHash = await computeCommitmentHash(amountTDU, salt, account.address);

      // Phase 1: Proving
      setTxState({
        id: `tx_${Date.now()}`,
        type: 'submit_bid',
        status: 'generating_proof',
        title: 'Generating Zero-Knowledge Proof',
        stepDescription: 'Constructing Groth16 witness locally. Your plaintext bid amount never leaves your client.',
        timestamp: Date.now(),
      });

      const proofResult = await midnightProofService.generatePrivateBidProof({
        bidAmount: BigInt(amountTDU),
        salt,
        auctionContract: targetAuction.contractAddress,
        bidderPk: account.address,
      });

      // Phase 2: Wallet Signature
      setTxState((prev) =>
        prev
          ? {
              ...prev,
              status: 'requesting_signature',
              title: 'Requesting Midnight Lace Authorization',
              stepDescription: 'Confirming zero-knowledge commitment transaction.',
            }
          : null
      );
      await new Promise((r) => setTimeout(r, 600));

      // Phase 3: Submitting to Midnight Ledger
      setTxState((prev) =>
        prev
          ? {
              ...prev,
              status: 'submitting_to_network',
              title: `Broadcasting to Midnight ${network}`,
              stepDescription: 'Adding confidential commitment to contract state tree...',
            }
          : null
      );
      await new Promise((r) => setTimeout(r, 800));

      const receiptId = `SEAL-REC-${targetAuction.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const txHash = proofResult.proofHash;

      const newBid: PrivateBid = {
        id: `bid_${Date.now()}`,
        auctionId,
        auctionTitle: targetAuction.title,
        bidderAddress: account.address,
        bidAmountTDU: amountTDU,
        commitmentHash,
        salt,
        submittedAt: Date.now(),
        status: 'sealed',
        txHash,
        proofGenerated: true,
        midnightReceiptId: receiptId,
      };

      // Update State & Persistent Storage
      const updatedBids = [newBid, ...userBids.filter((b) => b.auctionId !== auctionId)];
      setUserBids(updatedBids);
      safeSetJSON('sealbid_user_bids_ledger', updatedBids);

      const updatedAuctions = auctions.map((a) =>
        a.id === auctionId ? { ...a, bidderCount: a.bidderCount + 1 } : a
      );
      setAuctions(updatedAuctions);
      safeSetJSON('sealbid_auctions_ledger', updatedAuctions);

      setTxState((prev) =>
        prev
          ? {
              ...prev,
              status: 'confirmed',
              title: 'Private Bid Committed',
              stepDescription: 'Your bid is sealed. The amount is private to everyone except your local key.',
              txHash,
              proofHash: commitmentHash,
            }
          : null
      );

      showToast('privacy', 'Private Bid Committed', `Commitment ${commitmentHash.slice(0, 10)}... registered.`);
      return newBid;
    },
    [auctions, userBids, account, network, setTxState, showToast]
  );

  /**
   * Create a new Auction item and persist to ledger storage
   */
  const createAuction = useCallback(
    async (params: {
      title: string;
      description: string;
      imageUrl: string;
      category: any;
      startingBidTDU: number;
      reservePriceTDU?: number;
      durationHours?: number;
      durationMinutes?: number;
    }): Promise<AuctionItem> => {
      if (!account) {
        throw new Error('Please connect your Midnight wallet to create an auction.');
      }

      setTxState({
        id: `tx_create_${Date.now()}`,
        type: 'create_auction',
        status: 'generating_proof',
        title: 'Deploying Compact Auction Contract',
        stepDescription: `Preparing sealed-bid state parameters on Midnight ${network}...`,
        timestamp: Date.now(),
      });

      await new Promise((r) => setTimeout(r, 900));

      setTxState((prev) =>
        prev
          ? {
              ...prev,
              status: 'submitting_to_network',
              title: 'Confirming On-Chain Deployment',
              stepDescription: 'Registering auction contract to Midnight Indexer...',
            }
          : null
      );

      await new Promise((r) => setTimeout(r, 700));

      const newId = `auction-${Date.now().toString().slice(-4)}`;
      const contractAddress = `midnight1contract_auction_${Math.random().toString(36).substring(2, 10)}`;
      const startTime = Date.now();
      
      const totalDurationMs = params.durationMinutes !== undefined && params.durationMinutes > 0
        ? params.durationMinutes * 60 * 1000
        : (params.durationHours || 48) * 3600 * 1000;

      const endTime = startTime + totalDurationMs;

      const newAuction: AuctionItem = {
        id: newId,
        title: params.title,
        description: params.description,
        imageUrl: params.imageUrl || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
        category: params.category,
        sellerAddress: account.address,
        sellerName: 'You (Connected Wallet)',
        startingBidTDU: params.startingBidTDU,
        reservePriceTDU: params.reservePriceTDU,
        bidderCount: 0,
        startTime,
        endTime,
        status: 'active',
        contractAddress,
        isUserSeller: true,
        minBidIncrementTDU: Math.max(10, Math.floor(params.startingBidTDU * 0.05)),
        isPreprodVerified: true,
      };

      const updated = [newAuction, ...auctions];
      setAuctions(updated);
      safeSetJSON('sealbid_auctions_ledger', updated);

      setTxState((prev) =>
        prev
          ? {
              ...prev,
              status: 'confirmed',
              title: 'Auction Created',
              stepDescription: `Your private auction is live on Midnight ${network}.`,
              txHash: contractAddress,
            }
          : null
      );

      showToast('success', 'Auction Created', `"${params.title}" is now open for sealed bids.`);
      return newAuction;
    },
    [auctions, account, network, setTxState, showToast]
  );

  /**
   * Settle and verify auction winner via ZK Proof
   */
  const settleAuction = useCallback(
    async (auctionId: string): Promise<ZKVerificationProof> => {
      const target = auctions.find((a) => a.id === auctionId);
      if (!target) throw new Error('Auction not found.');

      setTxState({
        id: `tx_settle_${Date.now()}`,
        type: 'close_auction',
        status: 'generating_proof',
        title: 'Verifying Winning Bid Circuit',
        stepDescription: 'Compiling Compact ZK proof to verify highest commitment without revealing losing bids...',
        timestamp: Date.now(),
      });

      // Find real user bid for this auction if exists
      const bidsForAuction = userBids.filter((b) => b.auctionId === auctionId);
      let winnerAddress = 'midnight1q8w7e6r5t4y3u2i1o0p9a8s7d6f5g4h3j2';
      let winningBidAmount = Math.floor(target.startingBidTDU * 1.5);
      let winnerCommitment = `0xzk_commit_${target.startingBidTDU * 1.5}_${Date.now().toString(16)}`;

      if (bidsForAuction.length > 0) {
        // Highest bidder among participants
        const sorted = [...bidsForAuction].sort((a, b) => b.bidAmountTDU - a.bidAmountTDU);
        const highest = sorted[0];
        winnerAddress = highest.bidderAddress;
        winningBidAmount = highest.bidAmountTDU;
        winnerCommitment = highest.commitmentHash;

        // Update bid status
        const updatedUserBids = userBids.map((b) => {
          if (b.auctionId === auctionId) {
            return b.id === highest.id
              ? { ...b, status: 'won' as const, isWinner: true }
              : { ...b, status: 'lost' as const, isWinner: false };
          }
          return b;
        });
        setUserBids(updatedUserBids);
        safeSetJSON('sealbid_user_bids_ledger', updatedUserBids);
      }

      const proofRes = await midnightProofService.generateWinnerVerificationProof({
        auctionContract: target.contractAddress,
        winnerCommitment,
        merkleRoot: '0xmerkle_root_commitments_tree',
      });

      setTxState((prev) =>
        prev
          ? {
              ...prev,
              status: 'submitting_to_network',
              title: 'Submitting Proof to Settlement Verifier',
              stepDescription: `Finalizing auction status on Midnight ${network} ledger...`,
            }
          : null
      );

      await new Promise((r) => setTimeout(r, 700));

      const verificationProof: ZKVerificationProof = {
        auctionId,
        contractAddress: target.contractAddress,
        winnerCommitment,
        winnerAddress,
        winningBidTDU: winningBidAmount,
        proofType: 'Compact_Groth16',
        circuitName: 'SealedBidAuctionVerifier',
        verifierContract: 'midnight1verifier_sealed_auction_v1',
        verifiedAt: Date.now(),
        publicInputs: {
          auctionId,
          merkleRootOfCommitments: '0x9923847291837491823749817293847192837491827394817293847192837491',
          highestBidCommitment: winnerCommitment,
          auctionEndTime: target.endTime,
        },
        proofPayload: proofRes.proofBytes,
        verificationStatus: 'verified',
        unrevealedLosingBidsCount: Math.max(1, target.bidderCount - 1),
      };

      // Update state & persist
      const updatedProofs = { ...verificationProofs, [auctionId]: verificationProof };
      setVerificationProofs(updatedProofs);
      safeSetJSON('sealbid_proofs_ledger', updatedProofs);

      const updatedAuctions = auctions.map((a) =>
        a.id === auctionId
          ? {
              ...a,
              status: 'completed' as const,
              winnerAddress,
              winningBidTDU: winningBidAmount,
              winnerCommitmentHash: winnerCommitment,
              zkProofHash: proofRes.proofHash,
              verificationTimestamp: Date.now(),
            }
          : a
      );
      setAuctions(updatedAuctions);
      safeSetJSON('sealbid_auctions_ledger', updatedAuctions);

      setTxState((prev) =>
        prev
          ? {
              ...prev,
              status: 'confirmed',
              title: 'Auction Settled & Verified',
              stepDescription: 'Winner verified via Compact zero-knowledge circuit. Losing bids remain 100% confidential.',
              txHash: proofRes.proofHash,
            }
          : null
      );

      showToast('privacy', 'Auction Verified', `Winner verified via ZK-SNARK: ${winningBidAmount} tDU.`);
      return verificationProof;
    },
    [auctions, userBids, verificationProofs, network, setTxState, showToast]
  );

  return (
    <AuctionContext.Provider
      value={{
        auctions,
        userBids,
        userAuctions,
        filterOptions,
        setFilterOptions,
        filteredAuctions,
        getAuctionById,
        getVerificationProof,
        getUserBidForAuction,
        submitPrivateBid,
        createAuction,
        settleAuction,
      }}
    >
      {children}
    </AuctionContext.Provider>
  );
};

export const useAuctions = () => {
  const context = useContext(AuctionContext);
  if (!context) {
    throw new Error('useAuctions must be used within an AuctionProvider');
  }
  return context;
};
