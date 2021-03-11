/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;

library AddressUtils {
    function toPayable(address addr) internal pure returns (address payable) {
        return address(bytes20(addr));
    }

    /**
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     */
    function isContract(address addr) internal view returns (bool result) {
        assembly {
            result := iszero(iszero(extcodesize(addr)))
        }
    }
}
