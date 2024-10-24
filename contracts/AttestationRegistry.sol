// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IAttestationRegistry.sol";

/**
 * @title AttestationRegistry
 * @notice Manages ephemeral device attestations with expiry tracking
 */
contract AttestationRegistry is IAttestationRegistry, AccessControl {
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");

    struct Attestation {
        bytes32 sessionId;
        uint256 registeredAt;
        uint256 expiresAt;
        bool revoked;
    }

    mapping(bytes32 => Attestation) private _attestations;

    error AttestationExpired();
    error AttestationRevoked();
    error AttestationNotFound();
    error InvalidExpiry();

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @inheritdoc IAttestationRegistry
     */
    function registerAttestation(
        bytes32 sessionId,
        bytes32 attestationHash,
        uint256 expiry
    ) external override onlyRole(REGISTRAR_ROLE) {
        if (expiry <= block.timestamp) {
            revert InvalidExpiry();
        }

        _attestations[attestationHash] = Attestation({
            sessionId: sessionId,
            registeredAt: block.timestamp,
            expiresAt: expiry,
            revoked: false
        });

        emit AttestationRegistered(sessionId, attestationHash, expiry);
    }

    /**
     * @inheritdoc IAttestationRegistry
     */
    function validateAttestation(bytes32 attestationHash) external view override returns (bool valid) {
        Attestation memory attestation = _attestations[attestationHash];
        
        if (attestation.registeredAt == 0) {
            return false;
        }

        if (attestation.revoked) {
            return false;
        }

        if (block.timestamp > attestation.expiresAt) {
            return false;
        }

        return true;
    }

    /**
     * @inheritdoc IAttestationRegistry
     */
    function revokeAttestation(bytes32 attestationHash) external override onlyRole(REGISTRAR_ROLE) {
        Attestation storage attestation = _attestations[attestationHash];
        
        if (attestation.registeredAt == 0) {
            revert AttestationNotFound();
        }

        attestation.revoked = true;
        emit AttestationRevoked(attestationHash);
    }

    /**
     * @notice Get full attestation details
     * @param attestationHash The attestation hash
     * @return attestation The complete attestation data
     */
    function getAttestation(bytes32 attestationHash) external view returns (Attestation memory attestation) {
        return _attestations[attestationHash];
    }
}

