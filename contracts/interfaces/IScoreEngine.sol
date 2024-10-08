// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IScoreEngine
 * @notice Interface for maintaining liveness scores and penalty model
 */
interface IScoreEngine {
    event ScoreUpdated(address indexed user, int256 delta, uint256 newScore);

    event ScoreDecayed(address indexed user, uint256 oldScore, uint256 newScore);

    /**
     * @notice Get the current liveness score for a user
     * @param user The user address
     * @return score The current liveness score
     */
    function getLivenessScore(address user) external view returns (uint256 score);

    /**
     * @notice Update a user's liveness score
     * @param user The user address
     * @param delta Score change (positive or negative)
     */
    function updateScore(address user, int256 delta) external;

    /**
     * @notice Apply score decay for inactive users
     * @param user The user address
     */
    function applyDecay(address user) external;

    /**
     * @notice Get the last activity timestamp for a user
     * @param user The user address
     * @return timestamp Last activity timestamp
     */
    function getLastActivity(address user) external view returns (uint256 timestamp);
}

