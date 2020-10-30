/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "@aragon/govern-contract-utils/contracts/acl/ACL.sol";
import "@aragon/govern-contract-utils/contracts/minimal-proxies/ERC1167ProxyFactory.sol";

import "./GovernToken.sol";
import "./MerkleDistributor.sol";

contract GovernMinter is ACL {
    using ERC1167ProxyFactory for address;

    bytes4 constant internal MINT_ROLE =
        this.mint.selector ^
        this.merkleMint.selector
    ;

    GovernToken public token;
    address public distributorBase;

    event MintedSingle(address indexed to, uint256 amount, bytes context);
    event MintedMerkle(address indexed distributor, bytes32 indexed merkleRoot, uint256 totalAmount, bytes tree, bytes context);

    constructor(GovernToken _token, address _initialMinter, MerkleDistributor _distributorBase) ACL(_initialMinter) public {
        initialize(_token, _initialMinter, _distributorBase);
    }

    function initialize(GovernToken _token, address _initialMinter, MerkleDistributor _distributorBase) public initACL(_initialMinter) onlyInit("minter") {
        token = _token;
        distributorBase = address(_distributorBase);
        _grant(MINT_ROLE, _initialMinter);
    }

    function mint(address _to, uint256 _amount, bytes calldata _context) external auth(MINT_ROLE) {
        token.mint(_to, _amount);
        emit MintedSingle(_to, _amount, _context);
    }

    function merkleMint(bytes32 _merkleRoot, uint256 _totalAmount, bytes calldata _tree, bytes calldata _context) external auth(MINT_ROLE) returns (MerkleDistributor distributor) {
        address distributorAddr = distributorBase.clone(abi.encodeWithSelector(distributor.initialize.selector, token, _merkleRoot));
        token.mint(distributorAddr, _totalAmount);

        emit MintedMerkle(distributorAddr, _merkleRoot, _totalAmount, _tree, _context);

        return MerkleDistributor(distributorAddr);
    }

    function eject(address _newMinter) external auth(this.eject.selector) {
        token.changeMinter(_newMinter);
    }
}
