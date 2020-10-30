/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;

import "@aragon/govern-contract-utils/contracts/minimal-proxies/ERC1167ProxyFactory.sol";

import "../GovernToken.sol";
import "../GovernMinter.sol";
import "../MerkleDistributor.sol";

contract GovernTokenFactory {
    using ERC1167ProxyFactory for address;
    
    address public tokenBase;
    address public minterBase;
    address public distributorBase;

    constructor() public {
        setupBases();
    }

    function newToken() public returns (GovernToken token, GovernMinter minter) {
        
    }

    function setupBases() private {
        tokenBase = address(new GovernToken(address(this), "GovernToken base", "GTB", 0));
        distributorBase = address(new MerkleDistributor(ERC20(tokenBase), bytes32(0)));
        minterBase = address(new GovernMinter(GovernToken(tokenBase), address(this), MerkleDistributor(distributorBase)));
        
        GovernToken(tokenBase).changeMinter(minterBase);
        GovernMinter(minterBase).mint(msg.sender, 1, "test mint");
        GovernMinter(minterBase).merkleMint(bytes32(0), 1, "no tree", "test merkle mint");
    }
}
