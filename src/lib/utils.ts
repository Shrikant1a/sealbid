import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Truncate Midnight cryptographic address for UI display
 */
export function formatAddress(address?: string, start = 6, end = 4): string {
  if (!address) return '';
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

/**
 * Format Midnight TDU (Testnet Dust Units / Tokens)
 */
export function formatTDU(amount?: number): string {
  if (amount === undefined || amount === null) return '0.00 tDU';
  return `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} tDU`;
}

/**
 * Calculate remaining time formatted object
 */
export function getTimeRemaining(endTime: number) {
  const total = Math.max(0, endTime - Date.now());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
    isExpired: total <= 0,
  };
}

/**
 * Generate a random 32-byte hexadecimal salt for zero-knowledge witness
 */
export function generateRandomSalt(): string {
  const array = new Uint8Array(32);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < 32; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Simulate cryptographic commitment hash generation for UI preview receipt
 * Note: Once the Compact circuit WASM is linked, this is replaced by the circuit's Poseidon / Pedersen hash
 */
export async function computeCommitmentHash(
  bidAmount: number,
  salt: string,
  bidderAddress: string
): Promise<string> {
  const rawString = `sealbid_zk_commitment_${bidAmount}_${salt}_${bidderAddress}`;
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const msgUint8 = new TextEncoder().encode(rawString);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return '0x' + hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback hash
  return '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
}
