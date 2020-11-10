/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;

import "../minimal-proxies/ERC1167ProxyFactory.sol";
import "./ClonedContract.sol";
import "./ClonedContractWithInit.sol";

contract CloneFactoryMock {
    using ERC1167ProxyFactory for address;

    address public cloningContract;
    address public cloningContractWithInit;
    address public latestClonedContract;

    constructor() public {
        setupContracts();
    }

    function setupContracts() internal {
        cloningContract = address(new ClonedContract());
        cloningContractWithInit = address(new ClonedContractWithInit(''));
    }

    function clone() public {
        latestClonedContract = address(cloningContract.clone());
    }

    function cloneWithInitData() public {
        latestClonedContract = address(cloningContractWithInit.clone(bytes('INIT DATA')));
    }

    function clone2() public {
        latestClonedContract = address(cloningContract.clone2(bytes32(0)));
    }

    function clone2WithInitData() public {
        latestClonedContract = address(cloningContractWithInit.clone2(bytes32(0), bytes('INIT DATA')));
    }

    function generateCode() public view returns (bytes memory data) {
        return cloningContract.generateCode();
    }

    function getRevertMessage(bytes memory _data) public pure returns (string memory) {
        return ERC1167ProxyFactory._getRevertMsg(_data);
    }
}
