// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Versioned
 * @notice Contract versioning support
 */
abstract contract Versioned {
    string public constant VERSION = "0.1.0";

    function version() external pure returns (string memory) {
        return VERSION;
    }
}

