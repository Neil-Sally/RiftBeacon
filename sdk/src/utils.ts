import { ethers } from 'ethers';

/**
 * Utility functions for RiftBeacon SDK
 */

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
}

/**
 * Wait for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, i);
      await sleep(delay);
    }
  }
  throw new Error('Max retries reached');
}

/**
 * Format timestamp to readable string
 */
export function formatTimestamp(timestamp: number | bigint): string {
  const ts = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
  return new Date(ts * 1000).toISOString();
}

/**
 * Calculate time remaining until expiry
 */
export function getTimeRemaining(expiresAt: number | bigint): number {
  const expiry = typeof expiresAt === 'bigint' ? Number(expiresAt) : expiresAt;
  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, expiry - now);
}

/**
 * Validate session duration
 */
export function isValidDuration(duration: number): boolean {
  return duration >= 30 && duration <= 600;
}

/**
 * Generate random bytes
 */
export function generateRandomBytes(length: number): Uint8Array {
  return ethers.randomBytes(length);
}

/**
 * Hash data using keccak256
 */
export function hashData(...args: any[]): string {
  const encoded = ethers.solidityPacked(
    args.map(() => 'bytes32'),
    args
  );
  return ethers.keccak256(encoded);
}

