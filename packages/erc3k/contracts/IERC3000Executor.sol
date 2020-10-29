/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "./ERC3000Data.sol";

abstract contract IERC3000Executor {
    bytes4 internal constant ERC3000_EXEC_INTERFACE_ID = this.exec.selector;

    /**
     * @notice Executes all given actions
     * @param actions A array of ERC3000Data.Action for later executing those
     * @param allowFailuresMap A map with the allowed failures
     * @param memo The hash of the ERC3000Data.Container
     * @return failureMap
     * @return execResults
     */
    function exec(ERC3000Data.Action[] memory actions, bytes32 allowFailuresMap, bytes32 memo) virtual public returns (bytes32 failureMap, bytes[] memory execResults);
    event Executed(address indexed actor, ERC3000Data.Action[] actions, bytes32 memo, bytes32 failureMap, bytes[] execResults);
}
