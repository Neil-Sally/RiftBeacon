// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IZKVerifier
 * @notice Interface for zero-knowledge proof verification
 */
interface IZKVerifier {
    struct Proof {
        bytes32 commitment;
        bytes32 response;
        bytes32 challenge;
    }

    event ProofVerified(bytes32 indexed proofHash, address indexed prover);
    event CommitmentRegistered(bytes32 indexed commitment, address indexed prover);

    function verifyProof(Proof calldata proof, bytes32[] calldata publicInputs) external returns (bool valid);
    function registerCommitment(bytes32 commitment) external;
    function isProofVerified(bytes32 proofHash) external view returns (bool verified);
    function batchVerifyProofs(Proof[] calldata proofs, bytes32[][] calldata publicInputs) external returns (bool[] memory results);
}

