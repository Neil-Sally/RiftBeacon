// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ValidationLib
 * @notice Library for common validation operations
 */
library ValidationLib {
    error AddressZero();
    error ValueZero();
    error ArrayEmpty();
    error ArrayLengthMismatch();
    error StringEmpty();

    /**
     * @notice Validate address is not zero
     */
    function requireNonZeroAddress(address addr) internal pure {
        if (addr == address(0)) revert AddressZero();
    }

    /**
     * @notice Validate value is not zero
     */
    function requireNonZeroValue(uint256 value) internal pure {
        if (value == 0) revert ValueZero();
    }

    /**
     * @notice Validate array is not empty
     */
    function requireNonEmptyArray(uint256 length) internal pure {
        if (length == 0) revert ArrayEmpty();
    }

    /**
     * @notice Validate two arrays have same length
     */
    function requireMatchingLengths(uint256 length1, uint256 length2) internal pure {
        if (length1 != length2) revert ArrayLengthMismatch();
    }

    /**
     * @notice Validate string is not empty
     */
    function requireNonEmptyString(string memory str) internal pure {
        if (bytes(str).length == 0) revert StringEmpty();
    }

    /**
     * @notice Check if address is valid contract
     */
    function isContract(address addr) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }
}

