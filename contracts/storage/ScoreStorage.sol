// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ScoreStorage
 * @notice Storage pattern for score data
 */
library ScoreStorage {
    bytes32 constant STORAGE_POSITION = keccak256("riftbeacon.storage.score");

    struct Data {
        mapping(address => uint256) scores;
        mapping(address => uint256) lastUpdate;
        mapping(address => uint256) totalEarned;
    }

    function load() internal pure returns (Data storage ds) {
        bytes32 position = STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }
}

