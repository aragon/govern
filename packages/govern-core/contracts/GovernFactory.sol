/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "./Govern.sol";
import "./ERC3000Registry.sol";
import "./OptimisticQueue.sol";

contract OptimisticQueueFactory {
    function newQueue(address _aclRoot, ERC3000Data.Config memory _config)
        public
        returns (OptimisticQueue queue)
    {
        return new OptimisticQueue(_aclRoot, _config);
    }
}

contract GovernFactory {
    address internal constant ANY_ADDR = address(-1);

    OptimisticQueueFactory public queueFactory;
    ERC3000Registry public registry;

    constructor(ERC3000Registry _registry, OptimisticQueueFactory _queueFactory) public {
        queueFactory = _queueFactory;
        registry = _registry;
    }

    // Note: This will be moved somewhere else right?
    function newDummyGovern(string calldata _name) external returns (Govern govern, OptimisticQueue queue) {
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

        MiniACLData.BulkItem[] memory items = new MiniACLData.BulkItem[](6);
        items[0] = MiniACLData.BulkItem(MiniACLData.BulkOp.Grant, queue.schedule.selector, ANY_ADDR);
        items[1] = MiniACLData.BulkItem(MiniACLData.BulkOp.Grant, queue.execute.selector, ANY_ADDR);
        items[2] = MiniACLData.BulkItem(MiniACLData.BulkOp.Grant, queue.challenge.selector, ANY_ADDR);
        items[3] = MiniACLData.BulkItem(MiniACLData.BulkOp.Grant, queue.configure.selector, address(govern));
        items[4] = MiniACLData.BulkItem(MiniACLData.BulkOp.Revoke, queue.ROOT_ROLE(), address(this));
        items[5] = MiniACLData.BulkItem(MiniACLData.BulkOp.Freeze, queue.ROOT_ROLE(), address(0));

        queue.bulk(items);
    }
}
