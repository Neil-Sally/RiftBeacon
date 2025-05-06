// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ProxyFactory
 * @notice Factory for creating minimal proxies
 */
contract ProxyFactory {
    event ProxyCreated(address indexed proxy, address indexed implementation);

    function createProxy(address implementation) external returns (address proxy) {
        bytes20 targetBytes = bytes20(implementation);
        assembly {
            let clone := mload(0x40)
            mstore(clone, 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
            mstore(add(clone, 0x14), targetBytes)
            mstore(add(clone, 0x28), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)
            proxy := create(0, clone, 0x37)
        }
        require(proxy != address(0), "Proxy creation failed");
        emit ProxyCreated(proxy, implementation);
    }
}

