/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;

library BitmapLib {
    bytes32 constant internal empty = bytes32(0);
    bytes32 constant internal allowAll = empty;
    bytes32 constant internal denyAll = bytes32(uint256(-1));

    function flip(bytes32 map, uint8 index) internal pure returns (bytes32) {
        return bytes32(uint256(map) ^ uint256(1) << index);
    }

    function get(bytes32 map, uint8 index) internal pure returns (bool) {
        return bool(uint256(map) >> index & 1 == 1);
    }
}
