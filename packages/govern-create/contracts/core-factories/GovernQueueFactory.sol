/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "@aragon/govern-core/contracts/pipelines/GovernQueue.sol";
import "@aragon/govern-contract-utils/contracts/minimal-proxies/ERC1167ProxyFactory.sol";

contract GovernQueueFactory {
    using ERC1167ProxyFactory for address;
    
    address public base;

    constructor() public {
        setupBase();
    }

    function newQueue(address _aclRoot, ERC3000Data.Config memory _config, bytes32 _salt) public returns (GovernQueue queue) {
        if (_salt != bytes32(0)) {
            return GovernQueue(base.clone2(_salt, abi.encodeWithSelector(queue.initialize.selector, _aclRoot, _config)));
        } else {
            return new GovernQueue(_aclRoot, _config);
        }
    }

    function setupBase() internal {
        ERC3000Data.Collateral memory noCollateral;
        ERC3000Data.Config memory config = ERC3000Data.Config(
            0,
            noCollateral,
            noCollateral,
            noCollateral,
            address(0),
            ""
        );
        base = address(new GovernQueue(address(2), config));
    }
}
