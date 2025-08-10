// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Events
 * @notice Centralized event definitions for RiftBeacon
 */
library Events {
    // Gateway events
    event ChallengeIssued(
        bytes32 indexed sessionId,
        address indexed user,
        bytes32 challengeHash,
        uint256 expiresAt
    );

    event ResponseSubmitted(
        bytes32 indexed sessionId,
        address indexed user,
        bytes32 attestationHash,
        bool success
    );

    // Attestation events
    event AttestationRegistered(
        bytes32 indexed sessionId,
        bytes32 indexed attestationHash,
        uint256 expiresAt
    );

    event AttestationRevoked(bytes32 indexed attestationHash);

    // Nullifier events
    event NullifierConsumed(bytes32 indexed nullifier, address indexed consumer);

    // Score events
    event ScoreUpdated(address indexed user, int256 delta, uint256 newScore);
    event ScoreDecayed(address indexed user, uint256 oldScore, uint256 newScore);
    event ScoreInitialized(address indexed user, uint256 initialScore);

    // Penalty events
    event Penalized(address indexed user, uint256 amount, string reason);
    event Blacklisted(address indexed user, uint256 until);
    event BlacklistRemoved(address indexed user);

    // ZK events
    event ProofVerified(bytes32 indexed proofHash, address indexed prover);
    event CommitmentRegistered(bytes32 indexed commitment, address indexed prover);

    // Admin events
    event RoleGranted(bytes32 indexed role, address indexed account);
    event RoleRevoked(bytes32 indexed role, address indexed account);
    event ContractPaused(address indexed by);
    event ContractUnpaused(address indexed by);
}

