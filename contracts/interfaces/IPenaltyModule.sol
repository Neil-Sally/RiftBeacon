// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IPenaltyModule
 * @notice Interface for penalty and blacklisting management
 */
interface IPenaltyModule {
    struct Penalty {
        uint256 count;
        uint256 lastPenaltyTime;
        uint256 blacklistedUntil;
        string reason;
    }

    event Penalized(address indexed user, uint256 amount, string reason);
    event Blacklisted(address indexed user, uint256 until);
    event BlacklistRemoved(address indexed user);

    function applyPenalty(address user, uint256 amount, string calldata reason) external;
    function isBlacklisted(address user) external view returns (bool blacklisted);
    function getPenalty(address user) external view returns (Penalty memory penalty);
    function removeBlacklist(address user) external;
}

