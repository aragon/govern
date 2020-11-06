/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity 0.6.8;

interface IACLOracle {
    function willPerform(bytes4 role, address who, bytes calldata data) external returns (bool allowed);
}