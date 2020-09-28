/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "erc3k/contracts/IERC3000.sol";

import "./lib/MiniACL.sol";

contract Eaglet is ERC3000Data, MiniACL {
    bytes4 EXEC_ROLE = this.exec.selector;

    constructor(IERC3000 _initialExecutor) MiniACL(address(_initialExecutor)) public {
        _grant(EXEC_ROLE, address(_initialExecutor));
    }

    function exec(Action[] calldata actions) external auth(EXEC_ROLE) returns (bytes[] memory) {
        bytes[] memory execResults = new bytes[](actions.length);

        for (uint256 i = 0; i < actions.length; i++) {
            // todo: optimize with assembly
            (bool ok, bytes memory ret) = actions[i].to.call{value: actions[i].value}(actions[i].data);
            require(ok, "eaglet: call");
            
            execResults[i] = ret;
        }

        return execResults;
    }
}
