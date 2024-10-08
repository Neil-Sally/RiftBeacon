// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ILivenessGateway
 * @notice Interface for the main entry point of liveness proof submission
 */
interface ILivenessGateway {
    struct Session {
        address user;
        bytes32 challengeHash;
        uint256 timestamp;
        uint256 expiresAt;
        bool completed;
    }

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

    /**
     * @notice Start a new liveness challenge
     * @param challengeHash Hash of the challenge data
     * @param duration Time window for response in seconds
     * @return sessionId Unique identifier for this session
     */
    function startChallenge(bytes32 challengeHash, uint256 duration) external returns (bytes32 sessionId);

    /**
     * @notice Submit response to a liveness challenge
     * @param sessionId The session identifier
     * @param attestation Device attestation data
     * @param entropyHash Hash of entropy data from device
     */
    function submitResponse(
        bytes32 sessionId,
        bytes memory attestation,
        bytes32 entropyHash
    ) external;

    /**
     * @notice Get session information
     * @param sessionId The session identifier
     * @return session The session data
     */
    function getSession(bytes32 sessionId) external view returns (Session memory session);
}

