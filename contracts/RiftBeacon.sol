// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RiftBeacon
 * @notice Main deployment contract that references all modules
 * @dev This contract serves as an entry point and version marker
 */
contract RiftBeacon {
    string public constant NAME = "RiftBeacon";
    string public constant VERSION = "0.1.0";

    address public immutable livenessGateway;
    address public immutable attestationRegistry;
    address public immutable nullifierSet;
    address public immutable scoreEngine;
    address public immutable zkVerifier;
    address public immutable penaltyModule;

    event SystemDeployed(
        address indexed deployer,
        address livenessGateway,
        address attestationRegistry,
        address nullifierSet,
        address scoreEngine,
        address zkVerifier,
        address penaltyModule
    );

    constructor(
        address _livenessGateway,
        address _attestationRegistry,
        address _nullifierSet,
        address _scoreEngine,
        address _zkVerifier,
        address _penaltyModule
    ) {
        livenessGateway = _livenessGateway;
        attestationRegistry = _attestationRegistry;
        nullifierSet = _nullifierSet;
        scoreEngine = _scoreEngine;
        zkVerifier = _zkVerifier;
        penaltyModule = _penaltyModule;

        emit SystemDeployed(
            msg.sender,
            _livenessGateway,
            _attestationRegistry,
            _nullifierSet,
            _scoreEngine,
            _zkVerifier,
            _penaltyModule
        );
    }

    /**
     * @notice Get all contract addresses
     */
    function getAddresses() external view returns (
        address,
        address,
        address,
        address,
        address,
        address
    ) {
        return (
            livenessGateway,
            attestationRegistry,
            nullifierSet,
            scoreEngine,
            zkVerifier,
            penaltyModule
        );
    }
}

