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

    bytes public generatedCode;
    string public revertMessage;

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
        latestClonedContract = address(
            cloningContractWithInit.clone(
                abi.encodeWithSelector(
                    ClonedContractWithInit.init.selector,
                    bytes('INIT DATA')
                )
            )
        );
    }

    function clone2() public {
        latestClonedContract = address(cloningContract.clone2(bytes32(0)));
    }

    function clone2WithInitData() public {
        latestClonedContract = address(
            cloningContractWithInit.clone2(
                bytes32(0x0100000000000000000000000000000000000000000000000000000000000000),
                abi.encodeWithSelector(
                    ClonedContractWithInit.init.selector,
                    bytes('INIT DATA')
                )
            )
        );
    }

    function generateCode() public {
        generatedCode = cloningContract.generateCode();
    }

    function getRevertMessage(bytes memory _data) public {
        revertMessage = ERC1167ProxyFactory._getRevertMsg(_data);
    }
}
