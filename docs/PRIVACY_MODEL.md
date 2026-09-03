# SealBid Privacy & Security Model

This document outlines the cryptographic privacy guarantees and security architecture of the SealBid decentralized application, powered by the Midnight Network.

## Privacy Objectives
The primary goal of a sealed-bid auction is to ensure that participants' bids remain completely confidential during the active bidding phase, and that losing bids remain confidential forever.

## Zero-Knowledge Architecture

### 1. Bid Submission (The "Seal")
When a user places a bid in SealBid:
- **Private Inputs (Witness):** The exact `bidAmount` and a locally generated cryptographic `salt`.
- **Public Output:** A cryptographic hash representing the commitment.
- **Process:** The user's wallet generates a zero-knowledge proof (zk-SNARK) locally. The raw bid amount **never leaves the user's browser**. Only the commitment hash is broadcast and stored on the Midnight Preprod ledger.

### 2. Auction Settlement (The "Reveal")
When the auction ends, the settlement phase begins:
- **Assertion:** The Midnight Compact smart contract evaluates the state in zero-knowledge. It cryptographically verifies which commitment corresponds to the highest bid.
- **Outcome:** The smart contract publicly designates the winner and reveals *only* the winning bid amount.
- **Privacy Guarantee:** The raw amounts of all non-winning bids remain sealed mathematically. They are never revealed to the public, the seller, or other participants.

## Contract Security

### Seller-Authorized Settlement
To prevent malicious actors from prematurely or incorrectly settling an auction:
- The `settleWinningBid` function in the Midnight Compact contract strictly authenticates the caller.
- It verifies that the `callerPk` matches the authorized seller of the auction.
- This ensures that only the rightful owner of the auction can trigger the zero-knowledge evaluation and settlement phase.

### Front-Running Mitigation
Because bid amounts are hidden behind zero-knowledge commitments during the active auction window, malicious participants or block validators cannot see other users' bids to front-run them.

## Data Minimization
- **No centralized database:** User bids, salts, and private keys are never stored on a centralized server.
- **Local State:** Witness data (salts) are stored locally in the user's browser/wallet state for the duration required to generate proofs.
