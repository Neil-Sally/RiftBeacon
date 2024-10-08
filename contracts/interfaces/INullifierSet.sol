// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title INullifierSet
 * @notice Interface for enforcing uniqueness and preventing proof reuse
 */
interface INullifierSet {
    event NullifierConsumed(bytes32 indexed nullifier, address indexed consumer);

    /**
     * @notice Consume a nullifier to mark it as used
     * @param nullifier The nullifier to consume
     */
    function consumeNullifier(bytes32 nullifier) external;

    /**
     * @notice Check if a nullifier has been used
     * @param nullifier The nullifier to check
     * @return used True if the nullifier has been consumed
     */
    function isNullifierUsed(bytes32 nullifier) external view returns (bool used);
}

