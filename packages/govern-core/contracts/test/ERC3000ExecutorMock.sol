/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "erc3k/contracts/ERC3000Executor.sol";
import "erc3k/contracts/ERC3000.sol";

import "@aragon/govern-contract-utils/contracts/erc165/ERC165.sol";
import "@aragon/govern-contract-utils/contracts/erc165/ERC165.sol";

contract ERC3000ExecutorMock is ERC3000Executor, ERC165 {
    function exec(ERC3000Data.Action[] memory, bytes32, bytes32) override public returns (bytes32, bytes[] memory) {

    }

    function interfaceID() public pure returns (bytes4) {
        return ERC3000_EXEC_INTERFACE_ID;
    }

    function supportsInterface(bytes4 interfaceId) override public view returns (bool) {
        return interfaceId == ERC3000_EXEC_INTERFACE_ID;
    }
}
