// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title Timelock
 * @notice Timelock mechanism for administrative actions
 */
contract Timelock is AccessControl {
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");

    uint256 public constant MIN_DELAY = 1 days;
    uint256 public constant MAX_DELAY = 30 days;

    struct Operation {
        address target;
        bytes data;
        uint256 executeAt;
        bool executed;
    }

    mapping(bytes32 => Operation) public operations;

    event OperationScheduled(bytes32 indexed id, address indexed target, uint256 executeAt);
    event OperationExecuted(bytes32 indexed id);
    event OperationCancelled(bytes32 indexed id);

    error OperationNotReady();
    error OperationAlreadyExecuted();
    error InvalidDelay();

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function schedule(
        address target,
        bytes calldata data,
        uint256 delay
    ) external onlyRole(PROPOSER_ROLE) returns (bytes32 id) {
        if (delay < MIN_DELAY || delay > MAX_DELAY) {
            revert InvalidDelay();
        }

        id = keccak256(abi.encode(target, data, block.timestamp));
        uint256 executeAt = block.timestamp + delay;

        operations[id] = Operation({
            target: target,
            data: data,
            executeAt: executeAt,
            executed: false
        });

        emit OperationScheduled(id, target, executeAt);
    }

    function execute(bytes32 id) external onlyRole(EXECUTOR_ROLE) {
        Operation storage op = operations[id];

        if (block.timestamp < op.executeAt) {
            revert OperationNotReady();
        }

        if (op.executed) {
            revert OperationAlreadyExecuted();
        }

        op.executed = true;

        (bool success,) = op.target.call(op.data);
        require(success, "Execution failed");

        emit OperationExecuted(id);
    }

    function cancel(bytes32 id) external onlyRole(PROPOSER_ROLE) {
        delete operations[id];
        emit OperationCancelled(id);
    }
}

