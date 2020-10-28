/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../ERC3000Data.sol";

contract ERC3000ExecutorBadInterfaceMock is ERC3000Executor {
    function exec(ERC3000Data.Action[] memory, bytes32, bytes32) override public returns (bytes32, bytes[] memory) {

    }

    function supportsInterface(bytes4 interfaceId) override public view returns (bool) {
        return false;
    }
}
