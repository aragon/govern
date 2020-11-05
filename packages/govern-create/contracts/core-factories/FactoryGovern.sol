/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;

import "erc3k/contracts/IERC3000.sol";
import "@aragon/govern-core/contracts/Govern.sol";
import "@aragon/govern-contract-utils/contracts/minimal-proxies/ERC1167ProxyFactory.sol";
import "@aragon/govern-contract-utils/contracts/address-utils/AddressUtils.sol";

contract FactoryGovern {
    using ERC1167ProxyFactory for address;
    using AddressUtils for address;
    
    address public base;

    constructor() public {
        setupBase();
    }

    function newGovern(IERC3000 _initialExecutor, bytes32 _salt) public returns (Govern govern) {
        if (_salt != bytes32(0)) {
            return Govern(base.clone2(_salt, abi.encodeWithSelector(govern.initialize.selector, _initialExecutor)).toPayable());
        } else {
            return new Govern(address(_initialExecutor));
        }
    }

    function setupBase() private {
        base = address(new Govern(address(2)));
    }
}
