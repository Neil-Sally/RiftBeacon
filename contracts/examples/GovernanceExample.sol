// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IScoreEngine.sol";

/**
 * @title GovernanceExample
 * @notice Example DAO governance using liveness scores for voting power
 */
contract GovernanceExample is Ownable {
    IScoreEngine public immutable scoreEngine;

    uint256 public proposalCount;
    uint256 public constant MIN_SCORE_TO_PROPOSE = 2000;
    uint256 public constant MIN_SCORE_TO_VOTE = 500;
    uint256 public constant VOTING_PERIOD = 3 days;

    struct Proposal {
        address proposer;
        string description;
        uint256 startTime;
        uint256 endTime;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    mapping(uint256 => Proposal) public proposals;

    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description);
    event Voted(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);

    error InsufficientScoreToPropose(uint256 score, uint256 required);
    error InsufficientScoreToVote(uint256 score, uint256 required);
    error VotingNotActive(uint256 proposalId);
    error AlreadyVoted();
    error ProposalNotPassed();

    constructor(address _scoreEngine, address initialOwner) Ownable(initialOwner) {
        scoreEngine = IScoreEngine(_scoreEngine);
    }

    function propose(string calldata description) external returns (uint256 proposalId) {
        uint256 score = scoreEngine.getLivenessScore(msg.sender);
        if (score < MIN_SCORE_TO_PROPOSE) {
            revert InsufficientScoreToPropose(score, MIN_SCORE_TO_PROPOSE);
        }

        proposalId = proposalCount++;
        Proposal storage proposal = proposals[proposalId];
        proposal.proposer = msg.sender;
        proposal.description = description;
        proposal.startTime = block.timestamp;
        proposal.endTime = block.timestamp + VOTING_PERIOD;

        emit ProposalCreated(proposalId, msg.sender, description);
    }

    function vote(uint256 proposalId, bool support) external {
        Proposal storage proposal = proposals[proposalId];

        if (block.timestamp < proposal.startTime || block.timestamp > proposal.endTime) {
            revert VotingNotActive(proposalId);
        }

        if (proposal.hasVoted[msg.sender]) {
            revert AlreadyVoted();
        }

        uint256 score = scoreEngine.getLivenessScore(msg.sender);
        if (score < MIN_SCORE_TO_VOTE) {
            revert InsufficientScoreToVote(score, MIN_SCORE_TO_VOTE);
        }

        uint256 weight = _calculateVotingPower(score);
        proposal.hasVoted[msg.sender] = true;

        if (support) {
            proposal.forVotes += weight;
        } else {
            proposal.againstVotes += weight;
        }

        emit Voted(proposalId, msg.sender, support, weight);
    }

    function execute(uint256 proposalId) external onlyOwner {
        Proposal storage proposal = proposals[proposalId];

        if (block.timestamp <= proposal.endTime) {
            revert VotingNotActive(proposalId);
        }

        if (proposal.forVotes <= proposal.againstVotes) {
            revert ProposalNotPassed();
        }

        proposal.executed = true;

        emit ProposalExecuted(proposalId);
    }

    function _calculateVotingPower(uint256 score) private pure returns (uint256) {
        // Scale voting power by score (1 score = 1 vote, capped at 10000)
        return score;
    }

    function getProposal(uint256 proposalId) external view returns (
        address proposer,
        string memory description,
        uint256 startTime,
        uint256 endTime,
        uint256 forVotes,
        uint256 againstVotes,
        bool executed
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.proposer,
            proposal.description,
            proposal.startTime,
            proposal.endTime,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.executed
        );
    }
}

