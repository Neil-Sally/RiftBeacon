// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/ILivenessGateway.sol";
import "./interfaces/IAttestationRegistry.sol";
import "./interfaces/INullifierSet.sol";
import "./interfaces/IScoreEngine.sol";
import "./libraries/SessionLib.sol";
import "./libraries/EntropyLib.sol";

/**
 * @title LivenessGateway
 * @notice Main entry point for liveness proof submission and validation
 */
contract LivenessGateway is ILivenessGateway, AccessControl, ReentrancyGuard {
    using SessionLib for *;
    using EntropyLib for *;

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    uint256 public constant MIN_CHALLENGE_DURATION = 30 seconds;
    uint256 public constant MAX_CHALLENGE_DURATION = 10 minutes;
    uint256 public constant ENTROPY_MAX_AGE = 5 minutes;

    IAttestationRegistry public immutable attestationRegistry;
    INullifierSet public immutable nullifierSet;
    IScoreEngine public immutable scoreEngine;

    mapping(bytes32 => Session) private _sessions;

    error InvalidChallengeDuration();
    error SessionNotFound();
    error SessionExpired();
    error SessionAlreadyCompleted();
    error InvalidAttestation();
    error InvalidEntropy();

    constructor(
        address _attestationRegistry,
        address _nullifierSet,
        address _scoreEngine
    ) {
        attestationRegistry = IAttestationRegistry(_attestationRegistry);
        nullifierSet = INullifierSet(_nullifierSet);
        scoreEngine = IScoreEngine(_scoreEngine);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
    }

    /**
     * @inheritdoc ILivenessGateway
     */
    function startChallenge(
        bytes32 challengeHash,
        uint256 duration
    ) external override returns (bytes32 sessionId) {
        if (duration < MIN_CHALLENGE_DURATION || duration > MAX_CHALLENGE_DURATION) {
            revert InvalidChallengeDuration();
        }

        uint256 expiresAt = SessionLib.calculateExpiry(duration);
        sessionId = SessionLib.generateSessionId(msg.sender, challengeHash, block.timestamp);

        _sessions[sessionId] = Session({
            user: msg.sender,
            challengeHash: challengeHash,
            timestamp: block.timestamp,
            expiresAt: expiresAt,
            completed: false
        });

        emit ChallengeIssued(sessionId, msg.sender, challengeHash, expiresAt);
    }

    /**
     * @inheritdoc ILivenessGateway
     */
    function submitResponse(
        bytes32 sessionId,
        bytes memory attestation,
        bytes32 entropyHash
    ) external override nonReentrant {
        Session storage session = _sessions[sessionId];

        if (session.user == address(0)) {
            revert SessionNotFound();
        }

        if (session.user != msg.sender) {
            revert InvalidAttestation();
        }

        if (session.completed) {
            revert SessionAlreadyCompleted();
        }

        if (!SessionLib.isSessionValid(session.timestamp, session.expiresAt)) {
            revert SessionExpired();
        }

        if (!EntropyLib.validateEntropyHash(entropyHash)) {
            revert InvalidEntropy();
        }

        // Create attestation hash
        bytes32 attestationHash = keccak256(abi.encodePacked(sessionId, attestation, entropyHash));

        // Register attestation
        attestationRegistry.registerAttestation(sessionId, attestationHash, session.expiresAt + 1 hours);

        // Consume nullifier
        bytes32 nullifier = keccak256(abi.encodePacked(msg.sender, sessionId, block.timestamp));
        nullifierSet.consumeNullifier(nullifier);

        // Update score
        scoreEngine.updateScore(msg.sender, 100); // Positive score for successful proof

        session.completed = true;

        emit ResponseSubmitted(sessionId, msg.sender, attestationHash, true);
    }

    /**
     * @inheritdoc ILivenessGateway
     */
    function getSession(bytes32 sessionId) external view override returns (Session memory session) {
        return _sessions[sessionId];
    }

    /**
     * @notice Check if a session is valid and active
     * @param sessionId The session to check
     * @return valid True if session is valid
     */
    function isSessionActive(bytes32 sessionId) external view returns (bool valid) {
        Session memory session = _sessions[sessionId];
        return session.user != address(0) && 
               !session.completed && 
               SessionLib.isSessionValid(session.timestamp, session.expiresAt);
    }
}

