# SealBid - Demo Script (Level 5)

This script provides a step-by-step walkthrough for demonstrating SealBid's core value proposition: fully confidential sealed-bid auctions using Midnight's zero-knowledge capabilities.

## Setup & Prerequisites
1. **Network:** Ensure Lace wallet is connected to the Midnight **Preprod** network.
2. **Tokens:** Ensure the wallet has sufficient tDU (testnet Dust).
3. **Roles:** Ideally, demonstrate with two distinct wallets/browsers:
   - Wallet A (Alice - The Seller)
   - Wallet B (Bob - The Bidder)

---

## The Walkthrough

### Part 1: Connecting and Exploring (Wallet B - Bidder)
**Goal:** Show the clean onboarding UX and network validation.

1. **Action:** Open SealBid in a fresh browser session (or disconnect wallet if already connected).
2. **Narration:** "Welcome to SealBid. As a user, the first thing I notice is a clean, modern interface inviting me to participate in decentralized, private auctions."
3. **Action:** Click "Connect Wallet" and connect Lace.
4. **Action:** (Optional) Temporarily switch Lace to the "Preview" network.
5. **Narration:** "SealBid actively validates my network. If I'm on the wrong network, it immediately highlights the error in red, guiding me back to the correct Preprod environment."
6. **Action:** Switch back to Preprod.

### Part 2: Placing a Sealed Bid (Wallet B - Bidder)
**Goal:** Demonstrate the private bidding UX and ZK commitment.

1. **Action:** Navigate to an active auction card. Point out the countdown timer and the "Starting Reserve".
2. **Action:** Click "Place Private Bid" to enter the auction details page.
3. **Narration:** "Here I can see the details of the item. Let's place a bid. The UI clearly explains how this works: I enter my bid, and my wallet locally generates a cryptographic commitment."
4. **Action:** Enter a bid amount higher than the reserve. Point out the dynamically updating "ZK Public Output" hash in the Witness panel.
5. **Narration:** "As I type, my bid is combined with a random salt to create a unique hash. This hash is all that will ever touch the public ledger."
6. **Action:** Click "Submit Private Bid".
7. **Narration:** "We are now generating the zero-knowledge proof locally, then requesting authorization from my Lace wallet."
8. **Action:** Approve the transaction in Lace. Wait for the success modal.
9. **Narration:** "My bid is securely sealed. The raw amount remains strictly in my browser state."

### Part 3: Settling the Auction (Wallet A - Seller)
**Goal:** Demonstrate the zero-knowledge settlement phase.

1. **Action:** Switch context to the Seller's wallet (Wallet A).
2. **Action:** Navigate to the same auction, which is now artificially "Ended" (or wait for the timer).
3. **Narration:** "The auction time has concluded. As the authorized seller, I am the only one who can trigger the settlement phase."
4. **Action:** Click "Settle & Reveal Winner". Approve the transaction in Lace.
5. **Narration:** "The Midnight smart contract is now cryptographically evaluating all the sealed commitments. It's proving which commitment contains the highest valid value, without decrypting or revealing the losing bids."
6. **Action:** Wait for the confirmation. The UI updates to show the auction is "Settled & Verified" and reveals *only* the winning bid amount.
7. **Narration:** "The auction is settled. The winner is mathematically proven, but the privacy of all other participants remains intact forever."

---
*End of Demo.*
