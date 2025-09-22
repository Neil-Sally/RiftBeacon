// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "../interfaces/IScoreEngine.sol";

/**
 * @title BatchOperations
 * @notice Enables batch operations for gas efficiency
 */
contract BatchOperations is AccessControl {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    
    IScoreEngine public immutable scoreEngine;

    event BatchScoreUpdate(uint256 count, uint256 totalDelta);

    constructor(address _scoreEngine) {
        scoreEngine = IScoreEngine(_scoreEngine);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Update scores for multiple users in batch
     */
    function batchUpdateScores(
        address[] calldata users,
        int256[] calldata deltas
    ) external onlyRole(OPERATOR_ROLE) {
        require(users.length == deltas.length, "Length mismatch");
        
        uint256 totalDelta;
        for (uint256 i = 0; i < users.length; i++) {
            scoreEngine.updateScore(users[i], deltas[i]);
            if (deltas[i] > 0) {
                totalDelta += uint256(deltas[i]);
            }
        }

        emit BatchScoreUpdate(users.length, totalDelta);
    }

    /**
     * @notice Apply decay to multiple users
     */
    function batchApplyDecay(address[] calldata users) external {
        for (uint256 i = 0; i < users.length; i++) {
            scoreEngine.applyDecay(users[i]);
        }
    }
}

