/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../ERC3000Executor.sol";

contract ERC3000ExecutorMock is ERC3000Executor {
    function exec(ERC3000Data.Action[] memory actions) override public returns (bytes[] memory) {

    }

    function interfaceID() public pure returns (bytes4) {
        return ERC3000_EXEC_INTERFACE_ID;
    }
}
