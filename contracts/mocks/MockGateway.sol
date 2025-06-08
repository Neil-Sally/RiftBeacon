// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MockGateway
 * @notice Mock gateway for testing
 */
contract MockGateway {
    mapping(bytes32 => bool) private activeSessions;

    function startChallenge(bytes32 challengeHash, uint256) external returns (bytes32) {
        bytes32 sessionId = keccak256(abi.encodePacked(msg.sender, challengeHash, block.timestamp));
        activeSessions[sessionId] = true;
        return sessionId;
    }

    function isSessionActive(bytes32 sessionId) external view returns (bool) {
        return activeSessions[sessionId];
    }

    function completeSession(bytes32 sessionId) external {
        activeSessions[sessionId] = false;
    }
}

