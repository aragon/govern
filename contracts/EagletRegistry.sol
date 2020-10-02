/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;

import "erc3k/contracts/ERC3000Executor.sol";

import "./lib/MiniACL.sol";

contract EagletRegistry is MiniACL {
    mapping (string => bool) public nameUsed;

    event NewFactory(address indexed factory);
    event Registered(ERC3000Executor indexed dao, address indexed registrant, string name);
    event SetMetadata(ERC3000Executor indexed dao, bytes metadata);

    function register(ERC3000Executor _dao, string calldata _name, bytes calldata _initialMetadata)
        auth(this.register.selector)
        external
    {
        require(!nameUsed[_name], "registry: name used");
        
        // all will revert if `_dao` is not interface compliant in _setMetadata
        nameUsed[_name] = true;

        emit Registered(_dao, msg.sender, _name);
        _setMetadata(_dao, _initialMetadata);
    }

    function setMetadata(bytes memory _metadata) public {
        _setMetadata(ERC3000Executor(msg.sender), _metadata);
    }

    function _setMetadata(ERC3000Executor _dao, bytes memory _metadata) internal {
        require(_dao.supportsInterface(_dao.exec.selector), "registry: bad interface");

        emit SetMetadata(_dao, _metadata);
    }
}
