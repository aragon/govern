/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;

contract GovernRegistryMock  {

    event registerCalledWith(address executor, address queue, address token, string name, bytes initialMetada);

    function register(
        address _executor,
        address _queue,
        address _token,
        string calldata _name,
        bytes calldata _initialMetadata
    )  external
    {
        emit registerCalledWith(_executor, _queue, _token, _name, _initialMetadata);   
    }

}

