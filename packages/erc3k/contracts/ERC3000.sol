/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "@aragon/govern-contract-utils/contracts/erc165/ERC165.sol";

import "./IERC3000.sol";

abstract contract ERC3000 is IERC3000, ERC165 {
    bytes4 internal constant ERC3000_INTERFACE_ID =
        this.schedule.selector
        ^ this.execute.selector
        ^ this.challenge.selector
        ^ this.resolve.selector
        ^ this.veto.selector
        ^ this.configure.selector
    ;

    function supportsInterface(bytes4 _interfaceId) virtual override public pure returns (bool) {
        return _interfaceId == ERC3000_INTERFACE_ID || super.supportsInterface(_interfaceId);
    }
}
