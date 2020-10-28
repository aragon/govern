/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;

import "@aragon/govern-contract-utils/contracts/erc165/ERC165.sol";

import "erc3k/contracts/ERC3000.sol";
import "erc3k/contracts/ERC3000Executor.sol";
import "erc3k/contracts/ERC3000Registry.sol";

contract GovernRegistry is ERC3000Registry {
    mapping (string => bool) public nameUsed;

    function register(ERC3000Executor _dao, ERC3000 _queue, string calldata _name, bytes calldata _initialMetadata) external
    {
        require(!nameUsed[_name], "registry: name used");
        require(ERC165(address(_queue)).supportsInterface(ERC3000_INTERFACE_ID), "registry: bad interface queue");

        // all will revert if `_dao` is not interface compliant in _setMetadata
        nameUsed[_name] = true;

        emit Registered(_dao, _queue, msg.sender, _name);
        _setMetadata(_dao, _initialMetadata);
    }

    function setMetadata(bytes memory _metadata) public {
        _setMetadata(ERC3000Executor(msg.sender), _metadata);
    }

    function _setMetadata(ERC3000Executor _dao, bytes memory _metadata) internal {
        require(ERC165(address(_dao)).supportsInterface(_dao.exec.selector), "registry: bad interface dao");

        emit SetMetadata(_dao, _metadata);
    }
}
