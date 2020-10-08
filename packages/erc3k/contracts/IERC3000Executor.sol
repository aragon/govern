/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "./ERC3000Data.sol";

abstract contract IERC3000Executor {
    function exec(ERC3000Data.Action[] memory actions) virtual public returns (bytes[] memory);

    event Executed(address indexed actor, ERC3000Data.Action[] actions, bytes[] execResults);
}
