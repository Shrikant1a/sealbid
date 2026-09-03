# SealBid - Settlement Design Options

## The Problem
In the original MVP, the `settleWinningBid` logic simply accepted any claimed commitment that satisfied the reserve price. It did **not** verify that this commitment was actually submitted during the bidding phase, nor did it verify that it was the highest bid. 
To build a Level 5 product, we need a secure and robust settlement mechanism while maintaining the core "sealed bid" privacy proposition.

## Requirements
1. A bidder cannot fabricate a winning commitment that was never submitted.
2. A bidder cannot arbitrarily declare their own valid bid to be the winner.
3. The settlement process must have a clearly defined authorization model.
4. The implementation must accurately state what is mathematically proven on-chain versus what relies on off-chain game theory/reveal phases.

---

## Option A — Two-Phase Commit + Reveal

### Concept
This is the standard approach for sealed-bid auctions on ledgers without advanced accumulator/rollup proof systems. The auction is split into two distinct time phases:
1. **Commit Phase:** Bidders submit cryptographic commitments `Hash(bidAmount || salt || bidderPk)`. The amounts remain completely private.
2. **Reveal Phase:** Bidders reveal their `bidAmount` and `salt`. The smart contract (or an off-chain indexer/backend) verifies that these match the submitted commitments. The highest valid revealed bid is declared the winner.

### Execution in Compact
- **Commitment verification:** A `Map<Bytes<32>, Boolean>` or `commitmentsTreeRoot` is updated during bidding.
- **Reveal:** A new circuit `revealBid(bidAmount, salt, bidderPk, commitment)` is called, which verifies the commitment exists in the tree and updates a public `highestRevealedBid` if `bidAmount > currentHighest`.

### Advantages
- **Straightforward & Secure:** Extremely easy to reason about and implement securely in Compact.
- **Verifiable on-chain:** The contract definitively proves who had the highest revealed bid.
- **No complex cryptography:** Relies only on basic hash functions.

### Tradeoffs
- **Privacy Loss Post-Auction:** Bidders must reveal their bids to win. Losing bids that are revealed become public. (Though bidders can optionally choose *not* to reveal if they know they didn't win, this can break if everyone hides).

---

## Option B — ZK Maximum Proof (Proving Highest Bid in Zero-Knowledge)

### Concept
The contract uses a ZK proof to verify that a given bid is greater than or equal to all other submitted bids without revealing the values of the losing bids.

### Execution in Compact
- To prove a bid is the maximum, the prover must know the values of *all* other bids to prove `myBid >= otherBid_i`.
- In a decentralized system, bidders don't know each other's bids (that's the point of the auction). 
- To achieve this, a trusted party (like the Seller or an Oracle) would need to collect all the private bids off-chain via secure channels (e.g., public key encryption), and then the Seller submits a single ZK proof that "Bid X is the highest among all valid commitments Y".

### Advantages
- **Strong Privacy:** Losing bids are never revealed publicly. 

### Tradeoffs
- **High Complexity & Risk:** Requires off-chain encrypted communication channels to a centralized coordinator (the Seller).
- **Proving Limitations:** Compact's native data structures (like maps or trees) would need to be iterated over in a circuit to prove maximum, which is complex and expensive (or impossible for dynamic sizes).
- **Not truly decentralized:** Relies on the Seller not colluding or censoring bids.

---

## Conclusion & Selection

Given the constraints of the Midnight Compact language and the MVP nature of SealBid, **Option A (Two-Phase Commit + Reveal)** is the most viable, secure, and decentralized approach. Option B introduces too much architectural complexity (off-chain encrypted P2P messaging) and centralization risk for the current tech stack.

However, to minimize changes to the existing architecture while fully securing it under the "Option A" style, we can implement a **Seller-Authorized Settlement** model combined with **Commitment Membership Verification**:
1. The Seller (who knows they are the trusted party in this specific MVP) observes the bids. If we want true decentralization, we implement a public Reveal phase.
2. Given the user's requirement to preserve the existing architecture, the most reasonable adjustment for *this* iteration without completely rewriting the frontend to add a "Reveal" state is **Commitment Verification**.

### Selected Design: Authenticated Commitment Verification (Hybrid Option A)
We will enforce that `settleWinningBid` can only be called by a trusted entity (the Seller) OR we enforce that the `claimedCommitment` must be part of the `commitmentsTreeRoot`.
Wait, the easiest fix that meets all requirements is:
- **Only the Seller can settle the auction**, OR
- **We implement a Reveal Phase (Option A)**.

For this Level 5, we will choose a strict **Commitment Verification + Seller Authorized Settlement** approach. The Seller will act as the orchestrator to finalize the auction, providing a proof that a specific valid commitment won. This fixes the immediate bug (anyone can settle with a fake bid) while preserving the current ZK flow.

*Note: We will document clearly that in this model, the contract proves the winner was authorized by the seller and had a valid commitment, but does not autonomously prove it was mathematically the highest without an on-chain reveal phase.*
