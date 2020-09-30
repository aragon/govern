/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "./Eaglet.sol";
import "./OptimisticQueue.sol";

contract EagletFactory {
    address internal constant ANY_ADDR = address(-1);

    function newDummyEaglet() external {
        ERC3000Data.Collateral memory noCollateral;
        ERC3000Data.Config memory config = ERC3000Data.Config(
            0,
            noCollateral,
            noCollateral,
            noCollateral,
            address(0),
            ""
        );

        OptimisticQueue queue = new OptimisticQueue(address(this), config);
        Eaglet eaglet = new Eaglet(queue);

        MiniACLData.BulkItem[] memory items = new MiniACLData.BulkItem[](6);
        items[0] = MiniACLData.BulkItem(MiniACLData.BulkOp.Grant, queue.schedule.selector, ANY_ADDR);
        items[1] = MiniACLData.BulkItem(MiniACLData.BulkOp.Grant, queue.execute.selector, ANY_ADDR);
        items[2] = MiniACLData.BulkItem(MiniACLData.BulkOp.Grant, queue.challenge.selector, ANY_ADDR);
        items[3] = MiniACLData.BulkItem(MiniACLData.BulkOp.Grant, queue.configure.selector, address(eaglet));
        items[4] = MiniACLData.BulkItem(MiniACLData.BulkOp.Revoke, queue.ROOT_ROLE(), address(this));
        items[5] = MiniACLData.BulkItem(MiniACLData.BulkOp.Freeze, queue.ROOT_ROLE(), address(0));

        queue.bulk(items);

        emit NewEaglet(eaglet, queue);
    }

    event NewEaglet(Eaglet eaglet, OptimisticQueue queue);
}