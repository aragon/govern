/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;

library AddressUtils {
    function toPayable(address addr) internal pure returns (address payable) {
        return address(bytes20(addr));
    }

    function toAddress(address addr) internal pure returns (address payable) {
        return address(bytes20(addr));
    }

    function isContract(address addr) internal view returns (bool result) {
        assembly {
            result := not(iszero(extcodesize(addr)))
        }
    }
}