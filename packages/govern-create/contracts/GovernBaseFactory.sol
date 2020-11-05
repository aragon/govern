/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "@aragon/govern-core/contracts/GovernRegistry.sol";

import "@aragon/govern-token/contracts/FactoryGovernToken.sol";
import "@aragon/govern-token/contracts/interfaces/IERC20.sol";

import "./core-factories/FactoryGovern.sol";
import "./core-factories/FactoryGovernQueue.sol";

contract GovernBaseFactory {
    address internal constant ANY_ADDR = address(-1);

    FactoryGovern public governFactory;
    FactoryGovernQueue public queueFactory;
    FactoryGovernToken public tokenFactory;
    GovernRegistry public registry;

    constructor(
        GovernRegistry _registry,
        FactoryGovern _governFactory,
        FactoryGovernQueue _queueFactory,
        FactoryGovernToken _tokenFactory
    ) public {
        governFactory = _governFactory;
        queueFactory = _queueFactory;
        tokenFactory = _tokenFactory;
        registry = _registry;
    }

    function newGovernWithoutConfig(
        string calldata _name,
        IERC20 _token,
        string calldata _tokenName,
        string calldata _tokenSymbol,
        bool _useProxies
    ) external returns (Govern govern, GovernQueue queue) {
        bytes32 salt = _useProxies ? keccak256(abi.encodePacked(_name)) : bytes32(0);

        queue = queueFactory.newQueue(address(this), dummyConfig(), salt);
        govern = governFactory.newGovern(queue, salt);

        if (address(_token) == address(0)) {
            (_token,) = tokenFactory.newToken(
                address(this),
                _tokenName,
                _tokenSymbol,
                18, // NOTE: hardcoding due to stack to deep issues
                msg.sender,
                1 * 10 ** 18,
                _useProxies
            );
        }

        registry.register(govern, queue, _token, _name, "");

        ACLData.BulkItem[] memory items = new ACLData.BulkItem[](6);
        items[0] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.schedule.selector, ANY_ADDR);
        items[1] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.execute.selector, ANY_ADDR);
        items[2] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.challenge.selector, ANY_ADDR);
        items[3] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.configure.selector, address(govern));
        items[4] = ACLData.BulkItem(ACLData.BulkOp.Revoke, queue.ROOT_ROLE(), address(this));
        items[5] = ACLData.BulkItem(ACLData.BulkOp.Freeze, queue.ROOT_ROLE(), address(0));
        
        queue.bulk(items);
    }

    function dummyConfig() internal pure returns (ERC3000Data.Config memory) {
        ERC3000Data.Collateral memory noCollateral;
        return ERC3000Data.Config(
            0,
            noCollateral,
            noCollateral,
            address(0),
            ""
        );
    }
}
