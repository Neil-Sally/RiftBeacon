// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title StringLib
 * @notice String utility functions
 */
library StringLib {
    /**
     * @notice Convert string to bytes32
     */
    function toBytes32(string memory source) internal pure returns (bytes32 result) {
        bytes memory tempBytes = bytes(source);
        if (tempBytes.length == 0) {
            return 0x0;
        }
        assembly {
            result := mload(add(source, 32))
        }
    }

    /**
     * @notice Check if string is empty
     */
    function isEmpty(string memory str) internal pure returns (bool) {
        return bytes(str).length == 0;
    }

    /**
     * @notice Get string length
     */
    function length(string memory str) internal pure returns (uint256) {
        return bytes(str).length;
    }
}

