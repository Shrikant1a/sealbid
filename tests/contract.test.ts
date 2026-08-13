import { describe, it, expect, vi, beforeAll } from 'vitest';
import { formatAddress, formatTDU, getTimeRemaining, generateRandomSalt, computeCommitmentHash } from '../src/lib/utils';
import { SealedBidContractService } from '../src/lib/midnight/contract-interface';

describe('SealBid Cryptographic and Utility Helpers', () => {
  it('should format addresses correctly', () => {
    const address = 'midnight1w4e8r2t6y0u3i7o9p1a5s8d2f6g9h0j3k5';
    expect(formatAddress(address)).toBe('midnig...j3k5');
    expect(formatAddress('', 6, 4)).toBe('');
    expect(formatAddress(undefined)).toBe('');
  });

  it('should format token amounts in TDU correctly', () => {
    expect(formatTDU(1000)).toBe('1,000.00 tDU');
    expect(formatTDU(5.754)).toBe('5.754 tDU');
    expect(formatTDU(undefined)).toBe('0.00 tDU');
  });

  it('should calculate remaining time correctly', () => {
    const future = Date.now() + 5000;
    const remaining = getTimeRemaining(future);
    expect(remaining.isExpired).toBe(false);
    expect(remaining.total).toBeGreaterThan(0);

    const past = Date.now() - 5000;
    const remainingPast = getTimeRemaining(past);
    expect(remainingPast.isExpired).toBe(true);
    expect(remainingPast.total).toBe(0);
  });

  it('should generate a 32-byte (64 character) salt', () => {
    const salt = generateRandomSalt();
    expect(salt).toHaveLength(64);
    expect(/^[0-9a-f]{64}$/.test(salt)).toBe(true);
  });

  it('should compute commitment hash consistently', async () => {
    const amount = 500;
    const salt = generateRandomSalt();
    const address = 'midnight1w4e8r2t6y0u3i7o9p1a5s8d2f6g9h0j3k5';

    const hash = await computeCommitmentHash(amount, salt, address);
    expect(hash.startsWith('0x')).toBe(true);
    expect(hash).toHaveLength(66); // '0x' + 64 characters hex
  });
});

describe('SealedBidContractService Integration Layer', () => {
  let contractService: SealedBidContractService;

  beforeAll(() => {
    // Instantiate service without connected address (stub mode)
    contractService = new SealedBidContractService('');
  });

  it('should verify connection status correctly', () => {
    expect(contractService.isContractConnected()).toBe(false);
  });

  it('should successfully simulate deploying a new auction instance in stub mode', async () => {
    const result = await contractService.createAuction({
      title: 'Confidential Art Piece',
      startingPrice: BigInt(250),
      durationSeconds: BigInt(3600),
    });

    expect(result.contractAddress).toBeDefined();
    expect(result.contractAddress.startsWith('midnight1contract')).toBe(true);
    expect(result.txHash.startsWith('preprod_tx_deploy_')).toBe(true);
  });

  it('should successfully simulate submitting a private bid in stub mode', async () => {
    const result = await contractService.submitPrivateBid({
      auctionContractAddress: 'midnight1w4e8r2t6y0u3i7o9p1a5s8d2f6g9h0j3k5',
      bidAmount: BigInt(500),
      salt: '7a8f9c10d2b3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
    });

    expect(result.commitmentHash).toContain('0xzk_');
    expect(result.txHash.startsWith('preprod_tx_bid_')).toBe(true);
    expect(result.proof).toBe('zk_snark_groth16_midnight_compact_proof_payload');
  });

  it('should successfully simulate winner settlement in stub mode', async () => {
    const result = await contractService.settleAndVerifyWinner({
      auctionContractAddress: 'midnight1w4e8r2t6y0u3i7o9p1a5s8d2f6g9h0j3k5',
      revealedHighestBid: BigInt(1200),
      winnerSalt: '7a8f9c10d2b3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
      winnerPk: 'midnight1winner_pk_hash_address',
    });

    expect(result.winnerAddress).toBe('midnight1winner_pk_hash_address');
    expect(result.zkProof).toContain('zk_proof_verified_midnight_preprod_');
  });
});
