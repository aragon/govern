/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "erc3k/contracts/IERC3000.sol";
import "erc3k/contracts/ERC3000Executor.sol";

import "@aragon/govern-contract-utils/contracts/acl/ACL.sol";
import "@aragon/govern-contract-utils/contracts/bitmaps/BitmapLib.sol";

contract Govern is ERC3000Executor, ACL {
    using BitmapLib for bytes32;

    bytes4 internal constant EXEC_ROLE = this.exec.selector;
    uint256 internal constant MAX_ACTIONS = 256;

    event ETHDeposited(address indexed sender, uint256 value);

    constructor(IERC3000 _initialExecutor) ACL(address(this)) public {
        _grant(EXEC_ROLE, address(_initialExecutor));
    }

    receive () external payable {
        emit ETHDeposited(msg.sender, msg.value);
    }

    function exec(ERC3000Data.Action[] memory actions, bytes32 allowFailuresMap, bytes32 memo) override public auth(EXEC_ROLE) returns (bytes32, bytes[] memory) {
        require(actions.length <= MAX_ACTIONS, "govern: too many"); // need to limit since we use 256-bit bitmaps
        
        bytes[] memory execResults = new bytes[](actions.length);
        bytes32 failureMap = BitmapLib.empty; // start with an empty bitmap

        for (uint8 i = 0; i < actions.length; i++) { // can use uint8 given the action limit
            // TODO: optimize with assembly
            (bool ok, bytes memory ret) = actions[i].to.call{value: actions[i].value}(actions[i].data);
            require(ok || allowFailuresMap.get(i), "govern: call");
            // if a call fails, flip that bit to signal failure
            failureMap = ok ? failureMap : failureMap.flip(i);
            execResults[i] = ret;
        }

        emit Executed(msg.sender, actions, memo, failureMap, execResults);

        return (failureMap, execResults);
    }

    // TODO: ERC-1271
}
