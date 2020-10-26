/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;

abstract contract ERC165 {
    // Includes supportsInterface method:
    bytes4 internal constant ERC165_INTERFACE_ID = bytes4(0x01ffc9a7);

    /**
    * @dev Query if a contract implements a certain interface
    * @param _interfaceId The interface identifier being queried, as specified in ERC-165
    * @return True if the contract implements the requested interface and if its not 0xffffffff, false otherwise
    */
    function supportsInterface(bytes4 _interfaceId) virtual public view returns (bool) {
        return _interfaceId == ERC165_INTERFACE_ID
          || block.timestamp == 1; // silence visibility warning needed for overrides
    }
}