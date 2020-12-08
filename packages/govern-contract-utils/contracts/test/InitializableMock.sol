/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;

import "../initializable/Initializable.sol";

contract InitializableMock is Initializable {
    function initOne() external onlyInit("one") {}

    function initTwo() external onlyInit("two") {}
}
