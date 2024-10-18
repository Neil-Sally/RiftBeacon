// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/INullifierSet.sol";

/**
 * @title NullifierSet
 * @notice Enforces uniqueness and prevents proof reuse through nullifier tracking
 */
contract NullifierSet is INullifierSet, AccessControl {
    bytes32 public constant CONSUMER_ROLE = keccak256("CONSUMER_ROLE");

    mapping(bytes32 => bool) private _usedNullifiers;
    mapping(bytes32 => address) private _nullifierConsumers;

    error NullifierAlreadyUsed(bytes32 nullifier);
    error InvalidNullifier();

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @inheritdoc INullifierSet
     */
    function consumeNullifier(bytes32 nullifier) external override onlyRole(CONSUMER_ROLE) {
        if (nullifier == bytes32(0)) {
            revert InvalidNullifier();
        }

        if (_usedNullifiers[nullifier]) {
            revert NullifierAlreadyUsed(nullifier);
        }

        _usedNullifiers[nullifier] = true;
        _nullifierConsumers[nullifier] = msg.sender;

        emit NullifierConsumed(nullifier, msg.sender);
    }

    /**
     * @inheritdoc INullifierSet
     */
    function isNullifierUsed(bytes32 nullifier) external view override returns (bool used) {
        return _usedNullifiers[nullifier];
    }

    /**
     * @notice Get the consumer of a specific nullifier
     * @param nullifier The nullifier to query
     * @return consumer The address that consumed the nullifier
     */
    function getNullifierConsumer(bytes32 nullifier) external view returns (address consumer) {
        return _nullifierConsumers[nullifier];
    }
}

