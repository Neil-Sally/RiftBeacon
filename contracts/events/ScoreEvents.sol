// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ScoreEvents
 * @notice Event definitions for Score operations
 */
interface ScoreEvents {
    event ScoreIncreased(address indexed user, uint256 amount, uint256 newScore);
    event ScoreDecreased(address indexed user, uint256 amount, uint256 newScore);
    event ScoreReset(address indexed user, uint256 oldScore);
    event ThresholdReached(address indexed user, uint256 threshold);
}

