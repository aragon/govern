/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "erc3k/contracts/IERC3000.sol";
import "erc3k/contracts/ERC3000Executor.sol";

import "@aragon/govern-contract-utils/contracts/acl/MiniACL.sol";

contract Govern is ERC3000Executor, MiniACL {
    bytes4 internal constant EXEC_ROLE = this.exec.selector;

    event ETHDeposited(address indexed sender, uint256 value);

    constructor(IERC3000 _initialExecutor) MiniACL(address(this)) public {
        _grant(EXEC_ROLE, address(_initialExecutor));
    }

    receive () external payable {
        emit ETHDeposited(msg.sender, msg.value);
    }

    function exec(ERC3000Data.Action[] memory actions) override public auth(EXEC_ROLE) returns (bytes[] memory) {
        bytes[] memory execResults = new bytes[](actions.length);

        for (uint256 i = 0; i < actions.length; i++) {
            // todo: optimize with assembly
            (bool ok, bytes memory ret) = actions[i].to.call{value: actions[i].value}(actions[i].data);
            require(ok, "govern: call");

            execResults[i] = ret;
        }

        emit Executed(msg.sender, actions, execResults);

        return execResults;
    }

    // TODO: ERC-1271
}
