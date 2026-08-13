# SealBid - Setup & Development Guide

This guide describes how to set up the development environment, compile the Midnight Compact smart contract, and run tests locally.

---

## 1. Prerequisites

Before setting up, ensure you have the following installed on your system:
* **Node.js**: Version 18+ (Node 20 recommended)
* **Docker Desktop**: Required to run the local Midnight Proof Server.
* **Compact CLI**: The official command-line tool.

---

## 2. Installing the Compact CLI

### Linux / macOS / WSL
Execute the official installation script to install the Compact CLI:

```bash
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
```

Add the binary path to your environment (typically `$HOME/.local/bin` or `$HOME/.compact/bin`).

Install the latest compiler toolchain:
```bash
compact update
```

Verify your installation:
```bash
compact --version
compact compile --version
```

---

## 3. Compiling the Smart Contract

To compile the `sealed_bid_auction.compact` contract and generate the TypeScript bindings:

```bash
npm run compile:contract
```

This runs the compilation script under the hood:
```bash
compact compile contracts/sealed_bid_auction.compact managed/
```

The output will be placed in the `managed/` folder and includes:
* **ZK Circuit Definitions (`.zkir` files)**
* **TypeScript bindings/interfaces** for on-chain state queries.

---

## 4. Running the Local Test Suite

To run the unit tests:
```bash
npm run test
```

This will run all test suites in the `tests/` directory using Vitest, validating bid hashing and state transitions.
