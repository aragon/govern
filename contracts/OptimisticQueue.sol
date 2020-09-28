/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "./lib/MiniACL.sol";
import "erc3k/contracts/ERC3000.sol";

abstract contract OptimisticQueue is ERC3000, MiniACL {}

