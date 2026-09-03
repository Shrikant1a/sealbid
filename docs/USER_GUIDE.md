# SealBid User Guide

Welcome to SealBid, the fully confidential decentralized auction platform powered by the Midnight Network. This guide will walk you through the process of setting up your wallet, obtaining test tokens, and participating in your first sealed-bid auction.

## Prerequisites

Before using SealBid, you need to set up a compatible Midnight wallet and connect it to the Preprod network.

### 1. Install Lace Wallet
SealBid requires the Lace wallet, which includes built-in support for the Midnight Network's zero-knowledge capabilities.
1. Visit the [Lace Wallet website](https://www.lace.io/) and install the browser extension.
2. Follow the setup instructions to create a new wallet or restore an existing one.
3. Ensure you securely back up your seed phrase.

### 2. Switch to Midnight Preprod Network
SealBid operates on the Midnight Preprod network for testing and evaluation.
1. Open your Lace wallet extension.
2. Click on your profile/settings in the top right.
3. Navigate to **Network** settings.
4. Select **Midnight Preprod** from the list of available networks.

### 3. Obtain Testnet Tokens (tDU)
To place bids or create auctions, you need testnet Midnight Dust (tDU).
1. Visit the official [Midnight Preprod Faucet](https://faucet.preprod.midnight.network/).
2. Copy your Midnight Preprod address from your Lace wallet.
3. Paste the address into the faucet and request tokens.
4. Wait a few moments for the transaction to confirm and the tokens to appear in your wallet.

---

## Using SealBid

### Connecting Your Wallet
1. Navigate to the SealBid application.
2. Click the **Connect Wallet** button in the top right corner.
3. Select your Lace wallet and approve the connection request when prompted.
4. Ensure your wallet is set to the Preprod network; the application will warn you if you are on the wrong network.

### Placing a Sealed Bid
In a sealed-bid auction, your bid amount remains entirely confidential. Only a cryptographic hash (commitment) is recorded on the public ledger.

1. Browse the **Auctions** page and select an active auction.
2. Review the auction details, including the starting reserve price and the countdown timer.
3. In the bid panel, enter your bid amount (must be higher than the reserve).
4. Click **Submit Private Bid**.
5. Your wallet will generate a zero-knowledge proof locally on your device.
6. Approve the transaction in your Lace wallet to broadcast your commitment to the Preprod network.
7. Once confirmed, you will receive a Receipt ID. **Your bid is now sealed.**

### Auction Settlement
When the auction timer expires, the bidding window closes, and the settlement phase begins.

1. Any user (typically the seller or a participant) can trigger the **Settle & Reveal Winner** action on a closed auction.
2. The Midnight Compact smart contract evaluates all submitted commitments in zero-knowledge.
3. The contract identifies the highest valid bid without ever revealing the amounts of the losing bids.
4. If your bid is the highest, it will be marked as the winning bid, and the smart contract will process the outcome securely.

## Privacy Guarantee
SealBid ensures that your losing bids are **never** revealed to the public, the seller, or other participants. Only the winning bid amount is eventually disclosed to finalize the settlement, preserving the integrity and confidentiality of the auction process.
