/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;

import "./IERC3000.sol";
import "./IERC3000Executor.sol";

abstract contract IERC3000Registry is ERC3000Interface {
    /**
     * @notice Registers a IERC3000Executor and IERC3000 contract by a name and with his metadata
     * @param executor IERC3000Executor contract
     * @param queue IERC3000 contract
     * @param name The name of this DAO
     * @param initialMetadata Additional data to store for this DAO
     */
    function register(IERC3000Executor executor, IERC3000 queue, string calldata name, bytes calldata initialMetadata) virtual external;
    event Registered(IERC3000Executor indexed executor, IERC3000 queue, address indexed registrant, string name);

    /**
     * @notice Sets or updates the metadata of a DAO
     * @param metadata Additional data to store for this DAO
     */
    function setMetadata(bytes memory metadata) virtual public;
    event SetMetadata(IERC3000Executor indexed executor, bytes metadata);
}
