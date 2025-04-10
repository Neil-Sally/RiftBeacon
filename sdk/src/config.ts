/**
 * SDK Configuration constants
 */

export const DEFAULT_CONFIG = {
  challengeDuration: 300, // 5 minutes
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  entropyLength: 32,
  timeout: 30000, // 30 seconds
};

export const NETWORK_CONFIG = {
  optimism: {
    chainId: 10,
    rpcUrl: 'https://mainnet.optimism.io',
    explorerUrl: 'https://optimistic.etherscan.io',
  },
  base: {
    chainId: 8453,
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
  },
};

export const CONTRACT_NAMES = {
  LIVENESS_GATEWAY: 'LivenessGateway',
  ATTESTATION_REGISTRY: 'AttestationRegistry',
  NULLIFIER_SET: 'NullifierSet',
  SCORE_ENGINE: 'ScoreEngine',
  ZK_VERIFIER: 'ZKVerifier',
  PENALTY_MODULE: 'PenaltyModule',
};

