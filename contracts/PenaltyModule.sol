// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IScoreEngine.sol";

/**
 * @title PenaltyModule
 * @notice Manages penalties and blacklisting for farming prevention
 */
contract PenaltyModule is AccessControl {
    bytes32 public constant ENFORCER_ROLE = keccak256("ENFORCER_ROLE");

    uint256 public constant PENALTY_THRESHOLD = 500;
    uint256 public constant BLACKLIST_DURATION = 7 days;

    IScoreEngine public immutable scoreEngine;

    struct Penalty {
        uint256 count;
        uint256 lastPenaltyTime;
        uint256 blacklistedUntil;
        string reason;
    }

    mapping(address => Penalty) private _penalties;

    event Penalized(address indexed user, uint256 amount, string reason);
    event Blacklisted(address indexed user, uint256 until);
    event BlacklistRemoved(address indexed user);

    error UserBlacklisted(address user, uint256 until);
    error InvalidPenaltyAmount();

    constructor(address _scoreEngine) {
        scoreEngine = IScoreEngine(_scoreEngine);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Apply a penalty to a user
     * @param user The user to penalize
     * @param amount Score reduction amount
     * @param reason Reason for the penalty
     */
    function applyPenalty(
        address user,
        uint256 amount,
        string calldata reason
    ) external onlyRole(ENFORCER_ROLE) {
        if (amount == 0) {
            revert InvalidPenaltyAmount();
        }

        Penalty storage penalty = _penalties[user];
        penalty.count++;
        penalty.lastPenaltyTime = block.timestamp;
        penalty.reason = reason;

        // Apply score penalty
        scoreEngine.updateScore(user, -int256(amount));

        emit Penalized(user, amount, reason);

        // Check if user should be blacklisted
        uint256 currentScore = scoreEngine.getLivenessScore(user);
        if (currentScore < PENALTY_THRESHOLD || penalty.count >= 3) {
            _blacklistUser(user);
        }
    }

    /**
     * @notice Check if a user is currently blacklisted
     * @param user The user to check
     * @return blacklisted True if user is blacklisted
     */
    function isBlacklisted(address user) external view returns (bool blacklisted) {
        return _penalties[user].blacklistedUntil > block.timestamp;
    }

    /**
     * @notice Get penalty information for a user
     * @param user The user to query
     * @return penalty The penalty details
     */
    function getPenalty(address user) external view returns (Penalty memory penalty) {
        return _penalties[user];
    }

    /**
     * @notice Remove a user from blacklist (admin only)
     * @param user The user to unblacklist
     */
    function removeBlacklist(address user) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _penalties[user].blacklistedUntil = 0;
        emit BlacklistRemoved(user);
    }

    /**
     * @notice Internal function to blacklist a user
     * @param user The user to blacklist
     */
    function _blacklistUser(address user) private {
        uint256 blacklistUntil = block.timestamp + BLACKLIST_DURATION;
        _penalties[user].blacklistedUntil = blacklistUntil;
        emit Blacklisted(user, blacklistUntil);
    }

    /**
     * @notice Modifier to check if user is not blacklisted
     * @param user The user to check
     */
    modifier notBlacklisted(address user) {
        if (_penalties[user].blacklistedUntil > block.timestamp) {
            revert UserBlacklisted(user, _penalties[user].blacklistedUntil);
        }
        _;
    }
}

