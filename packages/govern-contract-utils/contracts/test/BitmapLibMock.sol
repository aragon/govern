/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;

import "../bitmaps/BitmapLib.sol";

contract BitmapLibMock {
    using BitmapLib for bytes32;
    
    bytes32 constant public empty = bytes32(0);
    bytes32 constant public allowAll = empty;
    bytes32 constant public denyAll = bytes32(uint256(-1));

    function flip(bytes32 map, uint8 index) external pure returns (bytes32) {
        return map.flip(index);
    }
    
    function get(bytes32 map, uint8 index) external pure returns (bool) {
        return map.get(index);
    }
}
