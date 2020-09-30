/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "./Eaglet.sol";
import "./OptimisticQueue.sol";

contract EagletFactory {
    function newEaglet() external {}

    event NewEaglet(Eaglet eaglet, OptimisticQueue queue);
}