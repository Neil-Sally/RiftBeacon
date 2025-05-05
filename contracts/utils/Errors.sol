// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Errors
 * @notice Custom error definitions for RiftBeacon contracts
 */
library Errors {
    // General errors
    error InvalidAddress();
    error ZeroAmount();
    error Unauthorized();
    error InvalidParameter();

    // Gateway errors
    error InvalidChallengeDuration();
    error SessionNotFound();
    error SessionExpired();
    error SessionAlreadyCompleted();
    error InvalidSession();

    // Attestation errors
    error InvalidAttestation();
    error AttestationExpired();
    error AttestationRevoked();
    error AttestationNotFound();
    error InvalidExpiry();

    // Entropy errors
    error InvalidEntropy();
    error EntropyNotFresh();
    error InsufficientEntropyStrength();

    // Nullifier errors
    error NullifierAlreadyUsed(bytes32 nullifier);
    error InvalidNullifier();

    // Score errors
    error ScoreOverflow();
    error ScoreUnderflow();
    error InvalidDelta();
    error InsufficientScore(uint256 current, uint256 required);

    // Penalty errors
    error UserBlacklisted(address user, uint256 until);
    error InvalidPenaltyAmount();
    error PenaltyThresholdReached();

    // ZK errors
    error ProofAlreadyVerified();
    error CommitmentAlreadyUsed();
    error InvalidProof();
    error ProofVerificationFailed();
}

