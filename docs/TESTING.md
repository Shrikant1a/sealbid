# SealBid Testing Matrix (Level 5)

This document outlines the comprehensive testing strategy for the SealBid application. The testing matrix covers unit tests, integration tests, UI/UX testing, and edge case scenarios to ensure robustness on the Midnight Preprod network.

## 1. Unit Tests (`vitest`)
Located in `tests/contract.test.ts`.

| Component / Function | Scenario | Expected Outcome | Status |
|---|---|---|---|
| Address Formatting | Handle valid, empty, and undefined addresses | Correctly shortened or empty strings | ✅ Passing |
| TDU Formatting | Format numbers to standardized TDU string | Correctly formatted string (e.g., `1,000.00 tDU`) | ✅ Passing |
| Time Remaining | Calculate future and past timestamps | Accurate `isExpired` boolean and time values | ✅ Passing |
| Salt Generation | Generate secure randomness for ZK commitments | 64-character valid hex string | ✅ Passing |
| Commitment Hash | Compute `hash(amount, salt, address)` | Consistent 66-character (0x-prefixed) hex string | ✅ Passing |

## 2. Integration / Contract Interaction Tests

| Component / Action | Scenario | Expected Outcome | Status |
|---|---|---|---|
| Contract Service | Initialize and check connection | Returns boolean indicating stub/real connection | ✅ Passing |
| Auction Creation | Simulate `createAuction` | Returns valid contract address and mock tx hash | ✅ Passing |
| Bid Submission | Simulate `submitPrivateBid` with valid data | Returns `commitmentHash`, `txHash`, and mock `proof` | ✅ Passing |
| Settlement | Simulate `settleAndVerifyWinner` (authorized) | Returns `winnerAddress`, `zkProof`, and `txHash` | ✅ Passing |
| Bid Validation | Submit negative bid amount | Throws `Error('Bid amount must be positive')` | ✅ Passing |
| Auth Validation | Settle auction with unauthorized `callerPk` | Throws `Error('Unauthorized: caller is not the seller')` | ✅ Passing |

## 3. UI/UX and User Flow Testing (Manual/Preprod)

| Flow | Scenario | Expected Outcome | Status |
|---|---|---|---|
| Wallet Onboarding | User visits without wallet | Prompted to connect Lace; clear instructions | ✅ Verified |
| Network Detection | User connects on Preview/Testnet | UI turns red; "Wrong Network" warning displayed | ✅ Verified |
| Bidding Process | User inputs valid bid > reserve | Proof generation status modal shown; success receipt provided | ✅ Verified |
| Auction Expiry | Timer reaches zero | Bid input disabled; Settlement CTA enabled | ✅ Verified |

## 4. Edge Cases

| Edge Case | Handling Mechanism |
|---|---|
| Insufficient Balance | Evaluated client-side before proof generation; error shown to user. |
| Bid Below Reserve | Evaluated client-side; form validation blocks submission. |
| Disconnected Wallet | All protected actions (Create, Bid, Settle) prompt wallet modal. |
