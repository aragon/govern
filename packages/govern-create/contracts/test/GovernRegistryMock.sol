/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;

contract GovernRegistryMock  {

    event registerCalledWith(address executor, address queue, address token, address minter, string name, bytes initialMetada);

    function register(
        address _executor,
        address _queue,
        address _token,
        address _minter,
        string calldata _name,
        bytes calldata _initialMetadata
    )  external
    {
        emit registerCalledWith(_executor, _queue, _token, _minter, _name, _initialMetadata);   
    }

}

