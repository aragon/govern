/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../ERC3000Data.sol";

contract ERC3000ExecutorBadInterfaceMock is ERC3000Executor {
    function exec(ERC3000Data.Action[] memory, bytes32, bytes32) override public returns (bytes32, bytes[] memory) {

    }

    function interfaceID() public pure returns (bytes4) {
        return bytes4(0x75b24222);
    }
}
