/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "./ERC3000Data.sol";

abstract contract IERC3000Executor {
    // Note: how is this expected to treat failing actions? especially when having multiple actions but one of them fails
    // does it worth to allow the user specify whether it should ignore failures or execute in strict mode?
    function exec(ERC3000Data.Action[] memory actions) virtual public returns (bytes[] memory);

    // Note: "actor" sounds a bit confusing, maybe executor, caller, or sender?
    // Note: not sure how efficient it is to log the whole actions array, is it actually necessary if these are
    // already being logged when the payload is scheduled? storing the hash should be enough
    event Executed(address indexed actor, ERC3000Data.Action[] actions, bytes[] execResults);
}
