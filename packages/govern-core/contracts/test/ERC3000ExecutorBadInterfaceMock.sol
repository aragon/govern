/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "erc3k/contracts/ERC3000Data.sol";
import "erc3k/contracts/IERC3000Executor.sol";

import "@aragon/govern-contract-utils/contracts/erc165/ERC165.sol";

contract ERC3000ExecutorBadInterfaceMock is IERC3000Executor, ERC165 {
    function exec(ERC3000Data.Action[] memory, bytes32, bytes32) override public returns (bytes32, bytes[] memory) {

    }

    function supportsInterface(bytes4 interfaceId) override public view returns (bool) {
        return false;
    }
}
