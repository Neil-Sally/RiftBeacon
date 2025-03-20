// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BytesLib
 * @notice Bytes utility functions
 */
library BytesLib {
    /**
     * @notice Convert bytes to bytes32
     */
    function toBytes32(bytes memory b) internal pure returns (bytes32) {
        require(b.length >= 32, "Bytes length must be at least 32");
        bytes32 out;
        assembly {
            out := mload(add(b, 32))
        }
        return out;
    }

    /**
     * @notice Concatenate two bytes
     */
    function concat(bytes memory a, bytes memory b) internal pure returns (bytes memory) {
        return abi.encodePacked(a, b);
    }

    /**
     * @notice Check if bytes are equal
     */
    function equal(bytes memory a, bytes memory b) internal pure returns (bool) {
        return keccak256(a) == keccak256(b);
    }
}

