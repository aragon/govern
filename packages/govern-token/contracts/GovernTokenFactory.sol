/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "@aragon/govern-contract-utils/contracts/minimal-proxies/ERC1167ProxyFactory.sol";

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
        setupBases();
    }

    function newToken(
        address _initialMinter,
        string calldata _tokenName,
        string calldata _tokenSymbol,
        uint8 _tokenDecimals,
        address _mintAddr,
        uint256 _mintAmount,
        bool _useProxies
    ) external returns (
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
                address(this),
                MerkleDistributor(distributorBase)
            )));
        }

        token.changeMinter(address(minter));
        if (_mintAmount > 0) minter.mint(_mintAddr, _mintAmount, "initial mint");

        bytes4 mintRole = minter.mint.selector ^ minter.merkleMint.selector;
        bytes4 rootRole = minter.ROOT_ROLE();

        ACLData.BulkItem[] memory items = new ACLData.BulkItem[](4);

        items[0] = ACLData.BulkItem(ACLData.BulkOp.Grant, mintRole, _initialMinter);
        items[1] = ACLData.BulkItem(ACLData.BulkOp.Grant, rootRole, _initialMinter);
        items[2] = ACLData.BulkItem(ACLData.BulkOp.Revoke, mintRole, address(this));
        items[3] = ACLData.BulkItem(ACLData.BulkOp.Revoke, rootRole, address(this));

        minter.bulk(items);

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
