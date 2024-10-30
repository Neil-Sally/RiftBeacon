// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IScoreEngine.sol";

/**
 * @title ScoreEngine
 * @notice Maintains liveness scores with decay and penalty mechanisms
 */
contract ScoreEngine is IScoreEngine, AccessControl {
    bytes32 public constant SCORER_ROLE = keccak256("SCORER_ROLE");

    uint256 public constant MAX_SCORE = 10000;
    uint256 public constant DECAY_RATE = 10; // 0.1% per day
    uint256 public constant DECAY_INTERVAL = 1 days;

    struct UserScore {
        uint256 score;
        uint256 lastActivity;
        uint256 lastDecay;
    }

    mapping(address => UserScore) private _scores;

    error ScoreOverflow();
    error InvalidDelta();

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @inheritdoc IScoreEngine
     */
    function getLivenessScore(address user) external view override returns (uint256 score) {
        return _scores[user].score;
    }

    /**
     * @inheritdoc IScoreEngine
     */
    function updateScore(address user, int256 delta) external override onlyRole(SCORER_ROLE) {
        UserScore storage userScore = _scores[user];
        
        uint256 currentScore = userScore.score;
        uint256 newScore;

        if (delta > 0) {
            newScore = currentScore + uint256(delta);
            if (newScore > MAX_SCORE) {
                newScore = MAX_SCORE;
            }
        } else if (delta < 0) {
            uint256 decrease = uint256(-delta);
            if (decrease > currentScore) {
                newScore = 0;
            } else {
                newScore = currentScore - decrease;
            }
        } else {
            return;
        }

        userScore.score = newScore;
        userScore.lastActivity = block.timestamp;

        emit ScoreUpdated(user, delta, newScore);
    }

    /**
     * @inheritdoc IScoreEngine
     */
    function applyDecay(address user) external override {
        UserScore storage userScore = _scores[user];
        
        uint256 timeSinceLastDecay = block.timestamp - userScore.lastDecay;
        if (timeSinceLastDecay < DECAY_INTERVAL) {
            return;
        }

        uint256 periods = timeSinceLastDecay / DECAY_INTERVAL;
        uint256 currentScore = userScore.score;
        
        if (currentScore == 0) {
            return;
        }

        uint256 decayAmount = (currentScore * DECAY_RATE * periods) / 10000;
        uint256 newScore = currentScore > decayAmount ? currentScore - decayAmount : 0;

        userScore.score = newScore;
        userScore.lastDecay = block.timestamp;

        emit ScoreDecayed(user, currentScore, newScore);
    }

    /**
     * @inheritdoc IScoreEngine
     */
    function getLastActivity(address user) external view override returns (uint256 timestamp) {
        return _scores[user].lastActivity;
    }

    /**
     * @notice Initialize score for a new user
     * @param user The user address
     * @param initialScore The initial score to set
     */
    function initializeScore(address user, uint256 initialScore) external onlyRole(SCORER_ROLE) {
        if (initialScore > MAX_SCORE) {
            revert ScoreOverflow();
        }

        _scores[user] = UserScore({
            score: initialScore,
            lastActivity: block.timestamp,
            lastDecay: block.timestamp
        });

        emit ScoreUpdated(user, int256(initialScore), initialScore);
    }
}

