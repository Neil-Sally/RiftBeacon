// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IOracle
 * @notice Interface for entropy and attestation oracle services
 */
interface IOracle {
    event EntropyVerified(bytes32 indexed entropyHash, address indexed requester, bool valid);
    event AttestationVerified(bytes attestation, address indexed requester, bool valid);

    function verifyEntropy(bytes32 entropyHash, bytes calldata proof) external returns (bool valid);
    function verifyDeviceAttestation(bytes calldata attestation, bytes calldata proof) external returns (bool valid);
    function getEntropyStrength(bytes32 entropyHash) external view returns (uint256 strength);
}

