// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Constants
 * @notice Global constants used across RiftBeacon contracts
 */
library Constants {
    // Time constants
    uint256 constant SECONDS_PER_DAY = 86400;
    uint256 constant SECONDS_PER_HOUR = 3600;
    uint256 constant SECONDS_PER_MINUTE = 60;

    // Score constants
    uint256 constant MAX_LIVENESS_SCORE = 10000;
    uint256 constant MIN_LIVENESS_SCORE = 0;
    uint256 constant INITIAL_SCORE = 100;
    
    // Challenge constants
    uint256 constant MIN_CHALLENGE_DURATION = 30;
    uint256 constant MAX_CHALLENGE_DURATION = 600;
    uint256 constant DEFAULT_CHALLENGE_DURATION = 300;
    
    // Entropy constants
    uint256 constant ENTROPY_MAX_AGE = 300; // 5 minutes
    uint256 constant MIN_ENTROPY_STRENGTH = 128; // bits
    
    // Penalty constants
    uint256 constant PENALTY_THRESHOLD = 500;
    uint256 constant BLACKLIST_DURATION = 7 days;
    uint256 constant MAX_PENALTIES_BEFORE_BLACKLIST = 3;
    
    // Decay constants
    uint256 constant DECAY_RATE_BPS = 10; // 0.1% = 10 basis points
    uint256 constant DECAY_INTERVAL = 1 days;
    uint256 constant BASIS_POINTS = 10000;
    
    // Attestation constants
    uint256 constant ATTESTATION_VALIDITY_EXTENSION = 1 hours;
    uint256 constant MAX_ATTESTATION_VALIDITY = 24 hours;
}

