/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "../ERC3000Data.sol";

contract ERC3000DataLibTest {
    using ERC3000Data for *;

    function testConfigHash(ERC3000Data.Config memory _initialConfig) public pure returns (bytes32) {
        return _initialConfig.hash();
    }

    function testContainerHash(ERC3000Data.Container memory _container) public view returns (bytes32) {
        return _container.hash();
    }

    function testPayloadHash(ERC3000Data.Payload memory _payload) public pure returns (bytes32) {
        return _payload.hash();
    }
}
