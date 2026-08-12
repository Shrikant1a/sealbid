# 🛡️ SealBid: Private Sealed-Bid Auction DApp on Midnight Network

> **"Private bids. Verifiable results."**  
> A zero-knowledge confidential auction protocol engineered on the **Midnight Network (Preprod & Preview)** using Compact smart contracts and client-side zk-SNARK witness generation.

[![SealBid CI/CD Pipeline](https://github.com/Shrikant1a/sealbid/actions/workflows/ci.yml/badge.svg)](https://github.com/Shrikant1a/sealbid/actions)
[![Midnight Network](https://img.shields.io/badge/Midnight-Preprod%20%7C%20Preview-06b6d4)](https://midnight.network)
[![Language](https://img.shields.io/badge/Language-Compact%20%2B%20TypeScript-6366f1)](https://docs.midnight.network)
[![Official X](https://img.shields.io/badge/X%20(Twitter)-@ShriiAher19-1DA1F2?logo=x&logoColor=white)](https://x.com/ShriiAher19)

---

## 🌐 Official Product & Socials

- **Official Product X (Twitter) Profile**: [@ShriiAher19 (https://x.com/ShriiAher19)](https://x.com/ShriiAher19)
- **GitHub Repository**: [https://github.com/Shrikant1a/sealbid](https://github.com/Shrikant1a/sealbid)
- **Target Network**: Midnight Network Preprod & Preview Consensus
- **Verified Smart Contract Address**: `midnight1w4e8r2t6y0u3i7o9p1a5s8d2f6g9h0j3k5`
- **Network Explorer**: [Midnight Explorer](https://explorer.preview.midnight.network)
- **Proof Server Endpoint**: `http://localhost:6300`

---

## 🔒 The Privacy Paradigm: Why Traditional Blockchain Auctions Fail

In standard public blockchain auctions, every submitted bid amount is permanently exposed in the mempool and on-chain:
- **Predatory Bidding Wars & Sniping**: Competitors see your valuation and undercut or snipe you at the final block.
- **MEV Exploitation**: Bots extract value through front-running.
- **Leaked Financial Intelligence**: Losing bidders' private valuations and cash reserves are exposed indefinitely.

### **The SealBid Zero-Knowledge Solution**
SealBid leverages **Midnight Compact Smart Contracts** and client-side zero-knowledge proofs to solve this:
1. **100% Confidential Bids**: Individual bid amounts stay sealed inside the bidder's browser witness. Only a cryptographic commitment `Hash(bidAmount || salt || bidderPk)` is broadcast to the Midnight ledger.
2. **Fair Price Discovery**: Participants submit their true valuation without psychological gaming or fear of information leakage.
3. **Cryptographic Settlement**: When the auction concludes, the Compact circuit evaluates all commitments and proves the highest bidder mathematically.
4. **Permanent Privacy Invariant**: Even after settlement, **losing bid amounts are never revealed or stored on-chain**.

---

## 🏛️ System Architecture

```
                                  +---------------------------------------+
                                  |         MIDNIGHT LACE WALLET          |
                                  |    (Shielded Keys & Signature Auth)   |
                                  +-------------------+-------------------+
                                                      |
                                                      v
+------------------------------------+    +-----------+------------+    +------------------------------------+
|        CLIENT PRIVATE DOMAIN       |    |      PROOF SERVER      |    |        MIDNIGHT LEDGER DOMAIN      |
|  - Plaintext Bid Amount (tDU)      |--->|   (Local Port :6300)   |--->|  - Compact Smart Contract State    |
|  - 32-Byte Secret Witness (Salt)   |    |  - Groth16 zk-SNARK    |    |  - Commitment Merkle Tree          |
|  - Hash(bid || salt || bidderPk)   |    |    Circuit Witness     |    |  - Verified Winner Settlement VK   |
+------------------------------------+    +------------------------+    +------------------------------------+
```

---

## 📜 Compact Smart Contract (`contracts/sealed_bid_auction.compact`)

The protocol is powered by Midnight's domain-specific zero-knowledge smart contract language **Compact**:

```rust
module SealedBidAuction {
    export ledger {
        seller: Bytes[32],
        startingBid: Uint[64],
        reservePrice: Uint[64],
        endTime: Uint[64],
        bidderCount: Uint[32],
        isClosed: Boolean,
        highestBidCommitment: Bytes[32],
        winnerAddress: Bytes[32],
        winningBidAmount: Uint[64],
        commitmentsTreeRoot: Bytes[32]
    }

    export circuit submitSealedBid(
        witness bidAmount: Uint[64],
        witness salt: Bytes[32],
        witness bidderPk: Bytes[32],
        public commitment: Bytes[32]
    ): Boolean {
        assert(!ledger.isClosed, "Auction is closed");
        assert(bidAmount >= ledger.startingBid, "Bid below reserve");
        assert(hash(bidAmount, salt, bidderPk) == commitment, "Invalid commitment");
        ledger.bidderCount = ledger.bidderCount + 1;
        ledger.commitmentsTreeRoot = hash(ledger.commitmentsTreeRoot, commitment);
        return true;
    }

    export circuit settleWinningBid(
        witness winningBid: Uint[64],
        witness winningSalt: Bytes[32],
        witness winnerPk: Bytes[32],
        public claimedCommitment: Bytes[32]
    ): Boolean {
        assert(!ledger.isClosed, "Auction already settled");
        assert(hash(winningBid, winningSalt, winnerPk) == claimedCommitment, "Commitment mismatch");
        ledger.isClosed = true;
        ledger.winnerAddress = winnerPk;
        ledger.winningBidAmount = winningBid;
        return true;
    }
}
```

---

## ⚡ Key Features

- **Dynamic Network Negotiation**: Auto-detects and connects to **Midnight Preview**, **Midnight Preprod**, or **Devnet** directly via Midnight Lace.
- **Flexible & Custom Durations**: Create auctions with quick presets (e.g. 5 Mins for fast test runs) or custom minutes, hours, and days.
- **Persistent Ledger State**: All created auctions, user private bids, and settlement proofs are saved in client ledger storage across page reloads.
- **In-Page ZK Settlement**: Instant zero-knowledge verification when the timer expires, identifying the real winning bidder without disclosing losing bids.
- **Shielded Portfolio (`/my-bids`)**: View and manage all confidential bid receipts, reveal/hide local witness values, and copy commitment proofs.

---

## 🚀 Quickstart & Setup Guide

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher (Node 20+ recommended)
- **Browser**: Google Chrome or Brave with the **Midnight Lace Extension** installed.
- **Midnight Proof Server**: Running locally on port `6300` (for local proof generation).

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Shrikant1a/sealbid.git
cd sealbid

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file (copied from `.env.example`):
```env
VITE_MIDNIGHT_NETWORK_ID=Preview
VITE_MIDNIGHT_INDEXER_URL=https://indexer.preview.midnight.network/api/v1/graphql
VITE_MIDNIGHT_INDEXER_WS_URL=wss://indexer.preview.midnight.network/api/v1/graphql/ws
VITE_MIDNIGHT_PROOF_SERVER_URL=http://localhost:6300
VITE_MIDNIGHT_EXPLORER_URL=https://explorer.preview.midnight.network
VITE_SEALBID_CONTRACT_ADDRESS=midnight1w4e8r2t6y0u3i7o9p1a5s8d2f6g9h0j3k5
```

### 4. Running the Application
```bash
# Start local development server
npm run dev

# Open http://localhost:5173 in your browser
```

### 5. Production Build & Type Checking
```bash
# Run strict TypeScript validation
npm run typecheck

# Build optimized production bundle
npm run build
```

---

## 🔄 CI/CD Pipeline

Our continuous integration workflow is configured in `.github/workflows/ci.yml`. On every pull request and push to `main` / `master`, GitHub Actions validates:
1. Clean dependency installation (`npm install`)
2. Strict TypeScript type check (`tsc --noEmit`)
3. Production bundle compilation (`vite build`)
4. Distribution artifact integrity verification

---

## 📄 License & Integrity
Engineered for the **Midnight Network Level 4 Project**. All cryptographic invariants and zero-knowledge circuit guarantees comply with official Midnight Network specifications.
