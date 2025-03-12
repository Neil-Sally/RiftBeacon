// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Math
 * @notice Mathematical utilities for RiftBeacon
 */
library Math {
    /**
     * @notice Calculate percentage safely
     */
    function percentage(uint256 value, uint256 percent) internal pure returns (uint256) {
        return (value * percent) / 100;
    }

    /**
     * @notice Calculate basis points
     */
    function basisPoints(uint256 value, uint256 bps) internal pure returns (uint256) {
        return (value * bps) / 10000;
    }

    /**
     * @notice Get minimum of two values
     */
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    /**
     * @notice Get maximum of two values
     */
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }

    /**
     * @notice Calculate average of two values
     */
    function average(uint256 a, uint256 b) internal pure returns (uint256) {
        return (a + b) / 2;
    }
}

