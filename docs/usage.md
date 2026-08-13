# SealBid - End-to-End Usage Guide

This document describes how to interact with the SealBid DApp, explaining the main workflows from creating auctions to submitting private bids and final settlement.

---

## 1. Connecting the Midnight Lace Wallet

1. Open the SealBid DApp (e.g. `http://localhost:5173` or https://sealbid.netlify.app/).
2. Click **Connect Wallet** in the top-right corner.
3. Approve the connection request in the **Midnight Lace** wallet extension popup.
4. Ensure your account is set to **Preview** or **Preprod** network and is funded with test tokens (tDU).

---

## 2. Creating a Confidential Auction

1. Navigate to the **Create Auction** page.
2. Enter the auction details:
   * **Title & Description**: Describe the asset being auctioned.
   * **Starting Price**: The minimum bidding threshold (in tDU).
   * **Duration**: Set the length of the bidding phase.
3. Click **Deploy Auction**.
4. Sign the transaction in the Lace wallet. The contract is deployed to the Midnight testnet, returning a contract address (e.g., `midnight1w4e8...`).

---

## 3. Placing a Confidential Bid

1. Find an active auction in the marketplace and click **Bid**.
2. Enter your private **Bid Amount**.
3. The frontend automatically:
   * Generates a unique cryptographically random **32-byte salt**.
   * Computes the commitment: `Hash(bidAmount || salt || bidderPk)`.
4. Click **Submit Bid** and sign with your wallet. Only the commitment hash is posted to the blockchain ledger.
5. **IMPORTANT**: Keep your salt and bid amount safe locally! The app stores these in your browser's local storage so you can prove your bid during the settlement phase.

---

## 4. Settling the Auction

1. Once the auction timer expires, the bidding phase ends.
2. The winning bidder (or seller) initiates the settlement process.
3. The DApp retrieves the winning bid's parameters from local storage and sends them to the local ZK Proof Server to generate a Groth16 settlement proof.
4. The transaction containing the proof and winning amount is sent to the network.
5. The contract verifies the proof, sets `isClosed = true`, and sets the winning bid and winner address on the ledger. All other losing bid values remain secret forever.
