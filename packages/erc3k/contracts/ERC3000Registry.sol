/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;

import "erc3k/contracts/ERC3000Executor.sol";
import "erc3k/contracts/ERC3000.sol";

contract ERC3000Registry {
    bytes4 internal constant ERC3000_INTERFACE_ID = 0x9abf68a8;

    mapping (string => bool) public nameUsed;

    event Registered(ERC3000Executor indexed executor, ERC3000 queue, address indexed registrant, string name);
    event SetMetadata(ERC3000Executor indexed executor, bytes metadata);

    function register(ERC3000Executor _executor, ERC3000 _queue, string calldata _name, bytes calldata _initialMetadata) external
    {
        require(!nameUsed[_name], "registry: name used");
        require(_queue.supportsInterface(ERC3000_INTERFACE_ID), "registry: bad interface queue");

        // all will revert if `_executor` is not interface compliant in _setMetadata
        nameUsed[_name] = true;

        emit Registered(_executor, _queue, msg.sender, _name);
        _setMetadata(_executor, _initialMetadata);
    }

    function setMetadata(bytes memory _metadata) public {
        _setMetadata(ERC3000Executor(msg.sender), _metadata);
    }

    function _setMetadata(ERC3000Executor _executor, bytes memory _metadata) internal {
        require(_executor.supportsInterface(_executor.exec.selector), "registry: bad interface executor");

        emit SetMetadata(_executor, _metadata);
    }
}
