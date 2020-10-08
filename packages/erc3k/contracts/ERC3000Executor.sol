/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "./lib/erc165/ERC165.sol";

import "./IERC3000Executor.sol";

abstract contract ERC3000Executor is IERC3000Executor, ERC165 {
    bytes4 internal constant ERC3000_EXEC_INTERFACE_ID = this.exec.selector;

    function supportsInterface(bytes4 _interfaceId) override public pure returns (bool) {
        return _interfaceId == ERC3000_EXEC_INTERFACE_ID || super.supportsInterface(_interfaceId);
    }
}
