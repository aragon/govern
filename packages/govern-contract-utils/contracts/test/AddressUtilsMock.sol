/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;

import "../address-utils/AddressUtils.sol";

contract AddressUtilsMock {

    using AddressUtils for address;
    
    function toPayable(address _addr) external pure returns(address) {
        return _addr.toPayable();
    }

    function isContract(address _addr) external view returns(bool){
        return _addr.isContract();
    }
    
}


