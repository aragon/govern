/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "erc3k/contracts/IERC3000Executor.sol";

import "@aragon/govern-contract-utils/contracts/erc165/ERC165.sol";
import "@aragon/govern-contract-utils/contracts/erc165/ERC165.sol";

contract ERC3000ExecutorMock is IERC3000Executor, ERC165 {
    uint256 public passedActionsLength;
    bytes32 public passedAllowFailuresMap;
    bytes32 public passedContainerHash;

    function exec(ERC3000Data.Action[] memory actions, bytes32 allowFailuresMap, bytes32 containerHash) override public returns (bytes32, bytes[] memory) {
        passedActionsLength = actions.length;
        passedAllowFailuresMap = allowFailuresMap;
        passedContainerHash = containerHash;

        return (bytes32(0), new bytes[](actions.length));
    }

    function interfaceID() public pure returns (bytes4) {
        return ERC3000_EXEC_INTERFACE_ID;
    }

    function supportsInterface(bytes4 interfaceId) override public view returns (bool) {
        return interfaceId == ERC3000_EXEC_INTERFACE_ID;
    }
}
