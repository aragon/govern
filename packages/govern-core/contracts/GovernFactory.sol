/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "erc3k/contracts/ERC3000Registry.sol";

import "./Govern.sol";
import "./pipelines/GovernQueue.sol";

contract GovernQueueFactory {
    function newQueue(address _aclRoot, ERC3000Data.Config memory _config)
        public
        returns (GovernQueue queue)
    {
        return new GovernQueue(_aclRoot, _config);
    }
}

contract GovernFactory {
    address internal constant ANY_ADDR = address(-1);

    GovernQueueFactory public queueFactory;
    ERC3000Registry public registry;

    constructor(ERC3000Registry _registry, GovernQueueFactory _queueFactory) public {
        queueFactory = _queueFactory;
        registry = _registry;
    }

    function newDummyGovern(string calldata _name) external returns (Govern govern, GovernQueue queue) {
        ERC3000Data.Collateral memory noCollateral;
        ERC3000Data.Config memory config = ERC3000Data.Config(
            0,
            noCollateral,
            noCollateral,
            noCollateral,
            address(0),
            ""
        );

        queue = queueFactory.newQueue(address(this), config);
        govern = new Govern(queue);

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
}
