/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "@aragon/govern-contract-utils/contracts/minimal-proxies/ERC1167ProxyFactory.sol";
import "./libraries/TokenLib.sol";

import "erc3k/contracts/IERC3000Executor.sol";

import "./GovernToken.sol";
import "./GovernMinter.sol";
import "./MerkleDistributor.sol";

contract GovernTokenFactory {
    using ERC1167ProxyFactory for address;
    
    address public tokenBase;
    address public minterBase;
    address public distributorBase;

    event CreatedToken(GovernToken token, GovernMinter minter);

    constructor() public {
        // setupBases();
        // This we disable since it fails for the contract code out of storage
    }

    function newToken(
        IERC3000Executor _governExecutor,
        TokenLib.TokenConfig calldata _token,
        bool _useProxies
    ) external returns (
        GovernToken token,
        GovernMinter minter
    ) {
        if (!_useProxies) {
            // (token, minter) = _deployContracts(_token.tokenName, _token.tokenSymbol, _token.tokenDecimals);
            // The idea of deployContract is moved again with the contract code out of storage
        } else {
            token = GovernToken(tokenBase.clone(abi.encodeWithSelector(
                token.initialize.selector,
                address(this),
                _token.tokenName,
                _token.tokenSymbol,
                _token.tokenDecimals
            ))); 
            minter = GovernMinter(minterBase.clone(abi.encodeWithSelector(
                minter.initialize.selector,
                token,
                address(this),
                MerkleDistributor(distributorBase)
            )));
        }

        token.changeMinter(address(minter));
        
        if (_token.mintAmount > 0) {
            minter.mint(_token.mintAddress, _token.mintAmount, "initial mint");
        }

        if (_token.merkleRoot != bytes32(0)) {
            minter.merkleMint(_token.merkleRoot, _token.merkleMintAmount, _token.merkleTree, _token.merkleContext);
        }

        bytes4 mintRole = minter.mint.selector ^ minter.merkleMint.selector;
        bytes4 rootRole = minter.ROOT_ROLE();

        ACLData.BulkItem[] memory items = new ACLData.BulkItem[](4);

        items[0] = ACLData.BulkItem(ACLData.BulkOp.Grant, mintRole, address(_governExecutor));
        items[1] = ACLData.BulkItem(ACLData.BulkOp.Grant, rootRole, address(_governExecutor));
        items[2] = ACLData.BulkItem(ACLData.BulkOp.Revoke, mintRole, address(this));
        items[3] = ACLData.BulkItem(ACLData.BulkOp.Revoke, rootRole, address(this));

        minter.bulk(items);

        emit CreatedToken(token, minter);
    }

    function setupBases(address _distributorBase, address _minter, address _token) public {
        distributorBase = _distributorBase;
        
        GovernToken token = GovernToken(_token);
        GovernMinter minter = GovernMinter(_minter);
        token.changeMinter(address(minter));

        // test the bases
        minter.mint(msg.sender, 1, "test mint");
        minter.merkleMint(bytes32(0), 1, "no tree", "test merkle mint");

        // store bases
        tokenBase = address(token);
        minterBase = address(minter);
    }

    // function _deployContracts(
    //     string memory _tokenName,
    //     string memory _tokenSymbol,
    //     uint8 _tokenDecimals
    // ) internal returns (
    //     GovernToken token,
    //     GovernMinter minter
    // ) {
    //     token = new GovernToken(address(this), _tokenName, _tokenSymbol, _tokenDecimals);
    //     minter = new GovernMinter(GovernToken(token), address(this), MerkleDistributor(distributorBase));
    // }
}
