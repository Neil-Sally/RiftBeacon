// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title GasOptimizations
 * @notice Library containing gas-optimized helper functions
 */
library GasOptimizations {
    /**
     * @notice Efficiently check if value is within range
     * @param value Value to check
     * @param min Minimum value (inclusive)
     * @param max Maximum value (inclusive)
     * @return valid True if within range
     */
    function isInRange(
        uint256 value,
        uint256 min,
        uint256 max
    ) internal pure returns (bool valid) {
        // Using assembly for gas optimization
        assembly {
            valid := and(iszero(lt(value, min)), iszero(gt(value, max)))
        }
    }

    /**
     * @notice Pack two uint128 values into single uint256
     * @param high High 128 bits
     * @param low Low 128 bits
     * @return packed Packed value
     */
    function pack(uint128 high, uint128 low) internal pure returns (uint256 packed) {
        assembly {
            packed := or(shl(128, high), low)
        }
    }

    /**
     * @notice Unpack uint256 into two uint128 values
     * @param packed Packed value
     * @return high High 128 bits
     * @return low Low 128 bits
     */
    function unpack(uint256 packed) internal pure returns (uint128 high, uint128 low) {
        assembly {
            high := shr(128, packed)
            low := and(packed, 0xffffffffffffffffffffffffffffffff)
        }
    }

    /**
     * @notice Calculate percentage with basis points
     * @param amount Base amount
     * @param bps Basis points (1 bps = 0.01%)
     * @return result Calculated percentage
     */
    function bpsToAmount(uint256 amount, uint256 bps) internal pure returns (uint256 result) {
        return (amount * bps) / 10000;
    }

    /**
     * @notice Safely add with overflow check
     * @param a First value
     * @param b Second value
     * @param max Maximum allowed result
     * @return result Sum capped at max
     */
    function cappedAdd(
        uint256 a,
        uint256 b,
        uint256 max
    ) internal pure returns (uint256 result) {
        unchecked {
            result = a + b;
            if (result > max || result < a) {
                result = max;
            }
        }
    }

    /**
     * @notice Safely subtract with underflow protection
     * @param a First value
     * @param b Second value
     * @return result Difference or 0 if would underflow
     */
    function safeSub(uint256 a, uint256 b) internal pure returns (uint256 result) {
        unchecked {
            result = a >= b ? a - b : 0;
        }
    }
}

