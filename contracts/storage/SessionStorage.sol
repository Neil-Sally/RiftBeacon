// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SessionStorage
 * @notice Storage pattern for session data
 */
library SessionStorage {
    bytes32 constant STORAGE_POSITION = keccak256("riftbeacon.storage.session");

    struct Data {
        mapping(bytes32 => bool) activeSessions;
        mapping(bytes32 => uint256) sessionExpiry;
        mapping(address => bytes32[]) userSessions;
    }

    function load() internal pure returns (Data storage ds) {
        bytes32 position = STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }
}

