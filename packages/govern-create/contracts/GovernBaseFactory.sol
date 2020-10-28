/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "govern-core/contracts/GovernRegistry.sol";

import "./core-factories/GovernFactory.sol";
import "./core-factories/GovernQueueFactory.sol";

contract GovernBaseFactory {
    address internal constant ANY_ADDR = address(-1);

    GovernFactory public governFactory;
    GovernQueueFactory public queueFactory;
    GovernRegistry public registry;

    constructor(GovernRegistry _registry, GovernFactory _governFactory, GovernQueueFactory _queueFactory) public {
        governFactory = _governFactory;
        queueFactory = _queueFactory;
        registry = _registry;
    }

    function newDummyGovern(string calldata _name, bool _useProxies) external returns (Govern govern, GovernQueue queue) {
        bytes32 salt = _useProxies ? keccak256(abi.encodePacked(_name)) : bytes32(0);

        queue = queueFactory.newQueue(address(this), dummyConfig(), salt);
        govern = governFactory.newGovern(queue, salt);

        registry.register(govern, queue, _name, "");

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
