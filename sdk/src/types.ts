/**
 * Type definitions for RiftBeacon SDK
 */

export interface Session {
  user: string;
  challengeHash: string;
  timestamp: number;
  expiresAt: number;
  completed: boolean;
}

export interface Attestation {
  sessionId: string;
  registeredAt: number;
  expiresAt: number;
  revoked: boolean;
}

export interface Penalty {
  count: number;
  lastPenaltyTime: number;
  blacklistedUntil: number;
  reason: string;
}

export interface SDKConfig {
  providerUrl: string;
  gatewayAddress: string;
  scoreEngineAddress?: string;
  nullifierSetAddress?: string;
  attestationRegistryAddress?: string;
}

export interface ChallengeOptions {
  duration?: number;
  customData?: Record<string, any>;
}

export interface ProofResult {
  sessionId: string;
  success: boolean;
  attestationHash?: string;
  error?: string;
}

