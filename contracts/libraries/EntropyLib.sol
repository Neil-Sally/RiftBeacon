// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title EntropyLib
 * @notice Library for entropy validation and processing
 */
library EntropyLib {
    uint256 constant MIN_ENTROPY_LENGTH = 32;
    uint256 constant MAX_ENTROPY_LENGTH = 128;

    /**
     * @notice Validate entropy hash meets minimum requirements
     * @param entropyHash The entropy hash to validate
     * @return valid True if entropy hash is valid
     */
    function validateEntropyHash(bytes32 entropyHash) internal pure returns (bool valid) {
        return entropyHash != bytes32(0);
    }

    /**
     * @notice Combine multiple entropy sources
     * @param source1 First entropy source
     * @param source2 Second entropy source
     * @param source3 Third entropy source
     * @return combined Combined entropy hash
     */
    function combineEntropy(
        bytes32 source1,
        bytes32 source2,
        bytes32 source3
    ) internal pure returns (bytes32 combined) {
        return keccak256(abi.encodePacked(source1, source2, source3));
    }

    /**
     * @notice Verify entropy freshness based on timestamp
     * @param timestamp The entropy generation timestamp
     * @param maxAge Maximum allowed age in seconds
     * @return fresh True if entropy is fresh enough
     */
    function isEntropyFresh(uint256 timestamp, uint256 maxAge) internal view returns (bool fresh) {
        return block.timestamp - timestamp <= maxAge;
    }
}

