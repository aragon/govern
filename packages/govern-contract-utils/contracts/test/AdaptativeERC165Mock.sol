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


contract AdaptativeERC165MockHelper {

    address addr;

    event ReceivedCallback(bytes32 b);

    constructor(address _addr) public {
        addr = _addr;
    }

    /**
     * @notice Executes fallback function on the AdaptativeERC165Mock and emits the returned value.
     * @param selector any kind of selector in order to call fallback
     */
    function handleCallback(bytes4 selector) external {
        (, bytes memory value) = addr.call(abi.encodeWithSelector(selector));
        bytes32 decoded = abi.decode(value, (bytes32));
        emit ReceivedCallback(decoded);
    }

}
