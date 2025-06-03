// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MockScoreEngine
 * @notice Mock score engine for testing
 */
contract MockScoreEngine {
    mapping(address => uint256) private scores;

    function getLivenessScore(address user) external view returns (uint256) {
        return scores[user];
    }

    function setScore(address user, uint256 score) external {
        scores[user] = score;
    }

    function updateScore(address user, int256 delta) external {
        if (delta > 0) {
            scores[user] += uint256(delta);
        } else {
            uint256 decrease = uint256(-delta);
            scores[user] = scores[user] > decrease ? scores[user] - decrease : 0;
        }
    }

    function getLastActivity(address user) external view returns (uint256) {
        return block.timestamp;
    }
}

