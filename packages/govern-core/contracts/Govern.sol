/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "erc3k/contracts/IERC3000Executor.sol";
import "erc3k/contracts/IERC3000.sol";

import "@aragon/govern-contract-utils/contracts/acl/ACL.sol";
import "@aragon/govern-contract-utils/contracts/adaptative-erc165/AdaptativeERC165.sol";
import "@aragon/govern-contract-utils/contracts/bitmaps/BitmapLib.sol";

contract Govern is AdaptativeERC165, IERC3000Executor, ACL {
    using BitmapLib for bytes32;

    bytes4 internal constant EXEC_ROLE = this.exec.selector;
    bytes4 internal constant REGISTER_ROLE = this.registerStandardAndCallback.selector;
    uint256 internal constant MAX_ACTIONS = 256;

    event ETHDeposited(address indexed sender, uint256 value);

    constructor(address _initialExecutor) ACL(address(this)) public {
        initialize(_initialExecutor);
    }

    function initialize(address _initialExecutor) public initACL(_initialExecutor) onlyInit("govern") {
        _grant(EXEC_ROLE, address(_initialExecutor));
        _grant(REGISTER_ROLE, address(_initialExecutor));
        _registerStandard(ERC3000_EXEC_INTERFACE_ID);
    }

    receive () external payable {
        emit ETHDeposited(msg.sender, msg.value);
    }

    fallback () external {
        _handleCallback(msg.sig, msg.data); // WARN: does a low-level return, any code below would be unreacheable
    }

    function exec(ERC3000Data.Action[] memory actions, bytes32 allowFailuresMap, bytes32 memo) override public auth(EXEC_ROLE) returns (bytes32, bytes[] memory) {
        require(actions.length <= MAX_ACTIONS, "govern: too many"); // need to limit since we use 256-bit bitmaps
        
        bytes[] memory execResults = new bytes[](actions.length);
        bytes32 failureMap = BitmapLib.empty; // start with an empty bitmap

        for (uint256 i = 0; i < actions.length; i++) { // can use uint8 given the action limit
            // TODO: optimize with assembly
            (bool ok, bytes memory ret) = actions[i].to.call{value: actions[i].value}(actions[i].data);
            require(ok || allowFailuresMap.get(uint8(i)), "govern: call");
            // if a call fails, flip that bit to signal failure
            failureMap = ok ? failureMap : failureMap.flip(uint8(i));
            execResults[i] = ret;
        }

        emit Executed(msg.sender, actions, memo, failureMap, execResults);

        return (failureMap, execResults);
    }

    function registerStandardAndCallback(bytes4 _interfaceId, bytes4 _callbackSig, bytes4 _magicNumber) external auth(REGISTER_ROLE) {
        _registerStandardAndCallback(_interfaceId, _callbackSig, _magicNumber);
    }

    // TODO: ERC-1271
}
