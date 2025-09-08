// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Modifiers
 * @notice Reusable modifier definitions
 */
abstract contract Modifiers {
    error InvalidAddress(address addr);
    error ZeroValue();
    error ExpiredTimestamp(uint256 timestamp);
    error NotExpired(uint256 expiresAt);

    modifier validAddress(address addr) {
        if (addr == address(0)) revert InvalidAddress(addr);
        _;
    }

    modifier nonZeroValue(uint256 value) {
        if (value == 0) revert ZeroValue();
        _;
    }

    modifier notExpired(uint256 expiresAt) {
        if (block.timestamp > expiresAt) revert ExpiredTimestamp(expiresAt);
        _;
    }

    modifier onlyExpired(uint256 expiresAt) {
        if (block.timestamp <= expiresAt) revert NotExpired(expiresAt);
        _;
    }
}

