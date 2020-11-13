/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;

import "../adaptative-erc165/AdaptativeERC165.sol";

contract AdaptativeERC165Mock is AdaptativeERC165 {

    fallback () external {
        _handleCallback(msg.sig, msg.data);
    }

    function registerStandardAndCallback(bytes4 _interfaceId, bytes4 _callbackSig, bytes4 _magicNumber) external {
        _registerStandardAndCallback(_interfaceId, _callbackSig, _magicNumber);
    }
}
