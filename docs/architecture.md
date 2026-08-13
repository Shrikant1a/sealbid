# SealBid - Privacy Architecture & ZK Model

This document describes the privacy model, ZK circuits, and DApp architecture of SealBid, a decentralized sealed-bid auction system built on the Midnight Network.

---

## 1. Zero-Knowledge State Isolation

A core tenant of Midnight Network's Compact smart contracts is the separation of public ledger state from private state (witnesses):

```
       +---------------------------------------------+
       |             CLIENT-SIDE DAPP / WALLET       |
       |                                             |
       |  Private State (Witnesses):                 |
       |    - bidAmount: Uint[64]                    |
       |    - salt: Bytes[32]                        |
       |    - bidderPk: Bytes[32]                    |
       |                                             |
       |              Calculates locally:            |
       |  Hash(bidAmount || salt || bidderPk)        |
       +----------------------|----------------------+
                              | Public Commitment Hash
                              v
       +---------------------------------------------+
       |             ON-CHAIN LEDGER                |
       |                                             |
       |  Public State:                              |
       |    - seller: Bytes[32]                      |
       |    - commitmentsTreeRoot: Bytes[32]         |
       |    - isClosed: Boolean                      |
       |    - winningBidAmount: Uint[64]             |
       +---------------------------------------------+
```

### On-Chain (Public Ledger) State
On-chain variables are stored in the shared state visible to all blockchain nodes.
* **`seller`**: The public key of the auction creator.
* **`startingBid`**: The minimum allowed bid amount.
* **`commitmentsTreeRoot`**: The root of the accumulator tree representing all sealed bids.
* **`isClosed`**: Boolean indicating if the bidding phase has ended.
* **`winnerAddress` / `winningBidAmount`**: Disclosed only at settlement to verify completion.

### Off-Chain (Private Client) State
These variables are processed entirely on the user's computer inside the browser/Midnight Lace Wallet extension. They are never broadcast over the network.
* **`bidAmount`**: The numeric value of the user's bid.
* **`salt`**: A 32-byte cryptographic random string.
* **`bidderPk`**: The bidder's private/public key interface.

---

## 2. Zero-Knowledge Circuit Logic

### A. Submitting Bids (`submitSealedBid`)
The circuit validates the bid's integrity before recording its commitment on the ledger:
1. **Assertion 1**: The auction must be open (`!ledger.isClosed`).
2. **Assertion 2**: The bid amount must meet or exceed the reserve minimum (`bidAmount >= ledger.startingBid`).
3. **Commitment Check**: Compares `Hash(bidAmount, salt, bidderPk)` against the provided public commitment hash.
4. **State Transition**: Increments the `ledger.bidderCount` and updates the commitments Merkle tree root accumulator.

### B. Winner Settlement (`settleWinningBid`)
To settle the auction, the winning bidder reveals their witnesses to prove they hold the winning commitment:
1. **Validation**: Verifies that the winner's witnesses hash matches the recorded commitment on the public ledger.
2. **Finalization**: Sets `ledger.isClosed = true`, and sets the winning amount and address on-chain.

---

## 3. Data Integrity & Threat Vectors

* **Bid Hiding**: Since commitments are generated via a one-way hashing function, no competitor can decrypt or brute-force the bid amount.
* **Bid Binding**: The bidder cannot change the bid amount or address during settlement, as it would cause the hash comparison to fail.
* **Zero Leakage**: All losing bid amounts, salts, and public keys remain permanently confidential on their respective client machines.
