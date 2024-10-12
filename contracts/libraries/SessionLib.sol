// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SessionLib
 * @notice Library for session management utilities
 */
library SessionLib {
    /**
     * @notice Generate a unique session ID
     * @param user The user address
     * @param challengeHash The challenge hash
     * @param timestamp The current timestamp
     * @return sessionId The generated session ID
     */
    function generateSessionId(
        address user,
        bytes32 challengeHash,
        uint256 timestamp
    ) internal pure returns (bytes32 sessionId) {
        return keccak256(abi.encodePacked(user, challengeHash, timestamp));
    }

    /**
     * @notice Validate session timing constraints
     * @param timestamp Session start time
     * @param expiresAt Session expiry time
     * @return valid True if session is within valid time window
     */
    function isSessionValid(uint256 timestamp, uint256 expiresAt) internal view returns (bool valid) {
        return block.timestamp >= timestamp && block.timestamp <= expiresAt;
    }

    /**
     * @notice Calculate expiry timestamp
     * @param duration Duration in seconds
     * @return expiresAt The expiry timestamp
     */
    function calculateExpiry(uint256 duration) internal view returns (uint256 expiresAt) {
        return block.timestamp + duration;
    }
}

