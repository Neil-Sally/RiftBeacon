// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IScoreEngine.sol";

/**
 * @title AirdropExample
 * @notice Example airdrop contract using RiftBeacon liveness scores
 */
contract AirdropExample is Ownable {
    IERC20 public immutable token;
    IScoreEngine public immutable scoreEngine;

    uint256 public constant MIN_LIVENESS_SCORE = 1000;
    uint256 public constant AIRDROP_AMOUNT = 100 * 10**18; // 100 tokens

    mapping(address => bool) public hasClaimed;

    event AirdropClaimed(address indexed user, uint256 amount);

    error InsufficientLivenessScore(uint256 score, uint256 required);
    error AlreadyClaimed();
    error InsufficientBalance();

    constructor(address _token, address _scoreEngine, address initialOwner) Ownable(initialOwner) {
        token = IERC20(_token);
        scoreEngine = IScoreEngine(_scoreEngine);
    }

    /**
     * @notice Claim airdrop tokens if user has sufficient liveness score
     */
    function claim() external {
        if (hasClaimed[msg.sender]) {
            revert AlreadyClaimed();
        }

        uint256 livenessScore = scoreEngine.getLivenessScore(msg.sender);
        if (livenessScore < MIN_LIVENESS_SCORE) {
            revert InsufficientLivenessScore(livenessScore, MIN_LIVENESS_SCORE);
        }

        uint256 balance = token.balanceOf(address(this));
        if (balance < AIRDROP_AMOUNT) {
            revert InsufficientBalance();
        }

        hasClaimed[msg.sender] = true;
        
        require(token.transfer(msg.sender, AIRDROP_AMOUNT), "Transfer failed");

        emit AirdropClaimed(msg.sender, AIRDROP_AMOUNT);
    }

    /**
     * @notice Check if user is eligible for airdrop
     * @param user Address to check
     * @return eligible True if user can claim
     */
    function isEligible(address user) external view returns (bool eligible) {
        if (hasClaimed[user]) {
            return false;
        }

        uint256 livenessScore = scoreEngine.getLivenessScore(user);
        return livenessScore >= MIN_LIVENESS_SCORE;
    }

    /**
     * @notice Withdraw remaining tokens (owner only)
     * @param amount Amount to withdraw
     */
    function withdraw(uint256 amount) external onlyOwner {
        require(token.transfer(msg.sender, amount), "Transfer failed");
    }
}

