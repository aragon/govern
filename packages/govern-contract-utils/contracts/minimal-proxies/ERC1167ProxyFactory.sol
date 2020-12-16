/*
 * SPDX-License-Identifier:    MIT
 */

// Inspired by: https://github.com/optionality/clone-factory

pragma solidity ^0.6.8;

library ERC1167ProxyFactory {
    function clone(address _implementation) internal returns (address cloneAddr) {
        bytes memory createData = generateCreateData(_implementation);

        assembly {
            cloneAddr := create(0, add(createData, 0x20), 55)
        }

        require(cloneAddr != address(0), "proxy-factory: bad create");
    }

    function clone(address _implementation, bytes memory _initData) internal returns (address cloneAddr) {
        cloneAddr = clone(_implementation);
        (bool ok, bytes memory ret) = cloneAddr.call(_initData);

        require(ok, _getRevertMsg(ret));
    }

    function clone2(address _implementation, bytes32 _salt) internal returns (address cloneAddr) {
        bytes memory createData = generateCreateData(_implementation);

        assembly {
            cloneAddr := create2(0, add(createData, 0x20), 55, _salt)
        }

        require(cloneAddr != address(0), "proxy-factory: bad create2");
    }

    function clone2(address _implementation, bytes32 _salt, bytes memory _initData) internal returns (address cloneAddr) {
        cloneAddr = clone2(_implementation, _salt);
        (bool ok, bytes memory ret) = cloneAddr.call(_initData);

        require(ok, _getRevertMsg(ret));
    }

    function generateCreateData(address _implementation) internal pure returns (bytes memory) {
        return abi.encodePacked(
            //---- constructor -----
            bytes10(0x3d602d80600a3d3981f3),
            //---- proxy code -----
            bytes10(0x363d3d373d3d3d363d73),
            _implementation,
            bytes15(0x5af43d82803e903d91602b57fd5bf3)
        );
    }

    // From: https://ethereum.stackexchange.com/a/83577
    function _getRevertMsg(bytes memory _returnData) internal pure returns (string memory) {
        // If the _res length is less than 68, then the transaction failed silently (without a revert message)
        if (_returnData.length < 68) return '';

        assembly {
            _returnData := add(_returnData, 0x04) // Slice the sighash.
        }
        return abi.decode(_returnData, (string)); // All that remains is the revert string
    }
}
