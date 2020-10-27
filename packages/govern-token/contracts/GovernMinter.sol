/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "@aragon/govern-contract-utils/contracts/acl/ACL.sol";
import "@aragon/govern-contract-utils/contracts/erc20/SafeERC20.sol";
import "@aragon/govern-contract-utils/contracts/minimal-proxies/ERC1167ProxyFactory.sol";

import "./GovernToken.sol";

contract GovernMinter is ACL {
    using ERC1167ProxyFactory for address;

    bytes4 constant internal MINT_ROLE =
        this.mint.selector ^
        this.merkleMint.selector
    ;

    GovernToken public token;
    address public distributorBase;

    event MintedSingle(address indexed to, uint256 amount, bytes context);
    event MintedMerkle(address indexed distributor, bytes32 indexed rootHash, uint256 totalAmount, bytes tree, bytes context);

    constructor(GovernToken _token, address _initialMinter, GovernMintDistributor _distributorBase) ACL(_initialMinter) public {
        initialize(_token, _initialMinter, _distributorBase);
    }

    function initialize(GovernToken _token, address _initialMinter, GovernMintDistributor _distributorBase) public initACL(_initialMinter) onlyInit("minter") {
        token = _token;
        distributorBase = address(_distributorBase);
    }

    function mint(address _to, uint256 _amount, bytes calldata _context) external auth(MINT_ROLE) {
        token.mint(_to, _amount);
        emit MintedSingle(_to, _amount, _context);
    }

    function merkleMint(bytes32 _rootHash, uint256 _totalAmount, bytes calldata _tree, bytes calldata _context) external auth(MINT_ROLE) returns (GovernMintDistributor distributor) {
        address distributorAddr = distributorBase.clone(abi.encodeWithSelector(distributor.initialize.selector, token, _rootHash));
        token.mint(distributorAddr, _totalAmount);

        emit MintedMerkle(distributorAddr, _rootHash, _totalAmount, _tree, _context);

        return GovernMintDistributor(distributorAddr);
    }

    function eject(address _newMinter) external auth(this.eject.selector) {
        token.changeMinter(_newMinter);
    }
}

contract GovernMintDistributor is Initializable {
    using SafeERC20 for ERC20;

    ERC20 public token;
    bytes32 public rootHash;

    mapping (address => bool) public hasClaimed;

    event Claimed(address indexed to, uint256 amount);

    function initialize(ERC20 _token, bytes32 _rootHash) onlyInit("distributor") external {
        token = _token;
        rootHash = _rootHash;
    }

    function claim(address _to, uint256 _amount, bytes calldata _proof) external {
        require(unclaimedBalance(_to, _amount, _proof) == _amount, "dist: bad claim");

        hasClaimed[_to] = true;
        token.safeTransfer(_to, _amount);

        emit Claimed(_to, _amount);
    }

    function unclaimedBalance(address _to, uint256 _amount, bytes memory _proof) public view returns (uint256) {
        if (hasClaimed[_to]) return 0;

        // TODO: check proof

        return _amount;
    }
}