// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title GatewayEvents
 * @notice Event definitions for Gateway operations
 */
interface GatewayEvents {
    event ChallengeCreated(bytes32 indexed sessionId, address indexed user, uint256 expiresAt);
    event ChallengeCompleted(bytes32 indexed sessionId, address indexed user, uint256 score);
    event ChallengeFailed(bytes32 indexed sessionId, address indexed user, string reason);
    event ChallengeExpired(bytes32 indexed sessionId, address indexed user);
}

