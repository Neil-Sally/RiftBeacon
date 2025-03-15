// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AddressLib
 * @notice Address utility functions
 */
library AddressLib {
    /**
     * @notice Check if address is a contract
     */
    function isContract(address addr) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }

    /**
     * @notice Validate address is not zero
     */
    function requireNotZero(address addr) internal pure {
        require(addr != address(0), "Address cannot be zero");
    }

    /**
     * @notice Get code hash of address
     */
    function getCodeHash(address addr) internal view returns (bytes32) {
        bytes32 hash;
        assembly {
            hash := extcodehash(addr)
        }
        return hash;
    }
}

