// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Registry
 * @notice Central registry for contract addresses
 */
contract Registry is Ownable {
    mapping(bytes32 => address) private contracts;

    event ContractUpdated(bytes32 indexed name, address indexed addr);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function setContract(string calldata name, address addr) external onlyOwner {
        bytes32 key = keccak256(bytes(name));
        contracts[key] = addr;
        emit ContractUpdated(key, addr);
    }

    function getContract(string calldata name) external view returns (address) {
        return contracts[keccak256(bytes(name))];
    }
}

