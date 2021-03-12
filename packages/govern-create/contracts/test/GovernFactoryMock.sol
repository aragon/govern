/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;

import "erc3k/contracts/IERC3000.sol";
import "@aragon/govern-core/contracts/Govern.sol";
import "@aragon/govern-contract-utils/contracts/address-utils/AddressUtils.sol";

contract GovernFactoryMock {

    using AddressUtils for address;

    event NewGovernCalledWith(IERC3000 executor, bytes32 salt);

    function newGovern(IERC3000 _initialExecutor, bytes32 _salt) public returns (Govern govern) {
        emit NewGovernCalledWith(_initialExecutor, _salt);
        return Govern(address(this).toPayable());
    }

}

