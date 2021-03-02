/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;

contract ClonedContractWithInit {
    string public randomString;

    constructor(string memory _randomString) public {
        init(_randomString);
    }

    function init(string memory _randomString) public {
        randomString = _randomString;
    }
}
