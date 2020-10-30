/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;

import "erc3k/contracts/IERC3000.sol";
import "erc3k/contracts/IERC3000Executor.sol";
import "erc3k/contracts/IERC3000Registry.sol";

import "@aragon/govern-contract-utils/contracts/erc165/ERC165.sol";

contract GovernRegistry is IERC3000Registry {
    mapping(string => bool) public nameUsed;

    function register(
        IERC3000Executor _executor,
        IERC3000 _queue,
        IERC20 _token,
        string calldata _name,
        bytes calldata _initialMetadata
    ) override external
    {
        require(!nameUsed[_name], "registry: name used");

        nameUsed[_name] = true;

        emit Registered(_executor, _queue, _token, msg.sender, _name);
        _setMetadata(_executor, _initialMetadata);
    }

    function setMetadata(bytes memory _metadata) override public {
        _setMetadata(IERC3000Executor(msg.sender), _metadata);
    }

    function _setMetadata(IERC3000Executor _executor, bytes memory _metadata) internal {
        emit SetMetadata(_executor, _metadata);
    }
}
