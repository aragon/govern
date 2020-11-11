/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;

contract ClonedContract {
    string internal constant randomString = "NO INIT";

    function getRandomString() public pure returns (string memory) {
        return randomString;
    }
}
