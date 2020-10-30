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

    event CreatedToken(GovernToken token, GovernMinter minter);

    constructor() public {
        setupBases();
    }

    function newToken(
        address _initialMinter,
        string memory _tokenName,
        string memory _tokenSymbol,
        uint8 _tokenDecimals,
        bool _useProxies
    ) public returns (
        GovernToken token,
        GovernMinter minter
    ) {
        if (!_useProxies) {
            (token, minter) = _deployContracts(_initialMinter, _tokenName, _tokenSymbol, _tokenDecimals);
        } else {
            token = GovernToken(tokenBase.clone(abi.encodeWithSelector(
                token.initialize.selector,
                address(this),
                _tokenName,
                _tokenSymbol,
                _tokenDecimals
            ))); 
            minter = GovernMinter(minterBase.clone(abi.encodeWithSelector(
                minter.initialize.selector,
                token,
                address(_initialMinter),
                MerkleDistributor(distributorBase)
            )));
        }

        token.changeMinter(address(minter));

        emit CreatedToken(token, minter);
    }

    function setupBases() private {
        distributorBase = address(new MerkleDistributor(ERC20(tokenBase), bytes32(0)));
        
        (GovernToken token, GovernMinter minter) = _deployContracts(
            address(this),
            "GovernToken base",
            "GTB",
            0
        );
        token.changeMinter(address(minter));

        // test the bases
        minter.mint(msg.sender, 1, "test mint");
        minter.merkleMint(bytes32(0), 1, "no tree", "test merkle mint");

        // store bases
        tokenBase = address(token);
        minterBase = address(minter);
    }

    function _deployContracts(
        address _initialMinter,
        string memory _tokenName,
        string memory _tokenSymbol,
        uint8 _tokenDecimals
    ) internal returns (
        GovernToken token,
        GovernMinter minter
    ) {
        token = new GovernToken(address(this), _tokenName, _tokenSymbol, _tokenDecimals);
        minter = new GovernMinter(GovernToken(token), address(_initialMinter), MerkleDistributor(distributorBase));
    }
}
