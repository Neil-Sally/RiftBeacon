// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IAttestationRegistry
 * @notice Interface for managing ephemeral device attestations
 */
interface IAttestationRegistry {
    event AttestationRegistered(
        bytes32 indexed sessionId,
        bytes32 indexed attestationHash,
        uint256 expiresAt
    );

    event AttestationRevoked(bytes32 indexed attestationHash);

    /**
     * @notice Register a new attestation
     * @param sessionId The session this attestation belongs to
     * @param attestationHash Hash of the attestation data
     * @param expiry Timestamp when this attestation expires
     */
    function registerAttestation(
        bytes32 sessionId,
        bytes32 attestationHash,
        uint256 expiry
    ) external;

    /**
     * @notice Validate if an attestation is still valid
     * @param attestationHash The attestation to validate
     * @return valid True if the attestation is valid and not expired
     */
    function validateAttestation(bytes32 attestationHash) external view returns (bool valid);

    /**
     * @notice Revoke an attestation before its expiry
     * @param attestationHash The attestation to revoke
     */
    function revokeAttestation(bytes32 attestationHash) external;
}

