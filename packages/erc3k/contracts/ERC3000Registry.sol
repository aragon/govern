/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;

import "@aragon/govern-contract-utils/contracts/erc165/ERC165.sol";

import "./ERC3000.sol";
import "./ERC3000Executor.sol";

abstract contract ERC3000Registry is ERC3000Interface {
    /**
     * @notice Registers a ERC3000Executor and ERC3000 contract by a name and with his metadata
     * @param dao ERC3000Executor contract
     * @param queue ERC3000 contract
     * @param name The name of this DAO
     * @param metadata Additional data to store for this DAO
     */
    function register(ERC3000Executor dao, ERC3000 queue, string calldata name, bytes calldata initialMetadata) external;
    event Registered(ERC3000Executor indexed dao, ERC3000 queue, address indexed registrant, string name);

    /**
     * @notice Sets or updates the metadata of a DAO
     * @param metadata Additional data to store for this DAO
     */
    function setMetadata(bytes memory metadata) public;
    event SetMetadata(ERC3000Executor indexed dao, bytes metadata);
}
