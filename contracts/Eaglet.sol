/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "erc3k/contracts/IERC3000.sol";

import "./lib/MiniACL.sol";

contract Eaglet is ERC3000Data, MiniACL {
    bytes4 EXEC_ROLE = this.exec.selector;

    constructor(IERC3000 _initialExecutor) MiniACL(address(this)) public {
        _grant(EXEC_ROLE, address(_initialExecutor));
    }

    function exec(Action[] calldata actions) external auth(EXEC_ROLE) {
        // exec now!
    }
}
