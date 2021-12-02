/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "@aragon/govern-core/contracts/GovernRegistry.sol";

import "@aragon/govern-token/contracts/interfaces/IERC20.sol";
import "@aragon/govern-token/contracts/libraries/TokenLib.sol";

import "./core-factories/GovernFactory.sol";
import "./core-factories/GovernQueueFactory.sol";

contract TechSubDaoFactory {
    address internal constant ANY_ADDR = address(-1);

    GovernFactory public governFactory;
    GovernQueueFactory public queueFactory;
    GovernRegistry public registry;
    Govern public mainDAOExecutor;

    event TechSubDAODeployed(
        Govern techGovern, GovernQueue indexed techQueue
    );

    constructor(
        GovernRegistry _registry,
        GovernFactory _governFactory,
        GovernQueueFactory _queueFactory,
        Govern _mainDAOExecutor
    ) public {
        governFactory = _governFactory;
        queueFactory = _queueFactory;
        registry = _registry;
        mainDAOExecutor = _mainDAOExecutor;
    }

    function _grantPermissions(Govern govern, GovernQueue queue, Govern vetoExecutor) internal {
        // Queue permissions
        uint256 bulkSize = 9;

        ACLData.BulkItem[] memory queueItems = new ACLData.BulkItem[](bulkSize);
        queueItems[0] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.execute.selector, ANY_ADDR);
        queueItems[1] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.challenge.selector, ANY_ADDR);
        queueItems[2] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.configure.selector, address(govern));
        queueItems[3] = ACLData.BulkItem(ACLData.BulkOp.Revoke, queue.ROOT_ROLE(), address(this));
        queueItems[4] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.ROOT_ROLE(), address(govern));
        queueItems[5] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.schedule.selector, address(0x806A940E1C431aa36077c4f6fB3e7d36CEF2a9A7)); // Member 1
        queueItems[6] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.schedule.selector, address(0x05cE4A75dB7dE6B5db8367680f1179f4e208906D)); // Member 2
        queueItems[7] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.schedule.selector, address(0xCE3d8791c1bdaCc6b8e1a52B4E6aC140F8a2C8c3)); // Member 3
        queueItems[8] = ACLData.BulkItem(ACLData.BulkOp.Freeze, queue.ROOT_ROLE(), address(0));

        queue.bulk(queueItems);

        // Govern Permissions
        ERC3000Data.Action[] memory actions = new ERC3000Data.Action[](3);
        actions[0] = ERC3000Data.Action({
        to: address(govern),
        value: 0,
        data: abi.encodeWithSelector(govern.grant.selector, govern.exec.selector, mainDAOExecutor)
        });
        actions[1] = ERC3000Data.Action({
        to: address(govern),
        value: 0,
        data: abi.encodeWithSelector(govern.grant.selector, govern.exec.selector, queue)
        });
        actions[2] = ERC3000Data.Action({
        to: address(govern),
        value: 0,
        data: abi.encodeWithSelector(govern.revoke.selector, govern.exec.selector, address(this))
        });

        govern.exec(actions, bytes32(0), bytes32(0));
    }

    function _createGovern(IERC20 token, string memory name, ERC3000Data.Config memory config, Govern vetoExecutor) internal returns (Govern govern, GovernQueue queue) {
        queue = queueFactory.newQueue(
            address(this),
            config,
            keccak256(abi.encodePacked(name))
        );

        govern = governFactory.newGovern(IERC3000(address(this)), keccak256(abi.encodePacked(name)));
        _grantPermissions(govern, queue, vetoExecutor);

        registry.register(govern, queue, token, address(-1), name, "");
    }

    function deployTechCommittee() internal returns (Govern govern, GovernQueue queue) {
        return _createGovern(
            IERC20(0x731B540B83292734F866fF1850532DF1D7A1F80e), // TECH COMMITTEE TOKEN
            "an_tech_dao",
            ERC3000Data.Config({
                executionDelay: 259200, // 3 days
                scheduleDeposit: ERC3000Data.Collateral({
                    token: address(0xa117000000f279D81A1D3cc75430fAA017FA5A2e),
                    amount: 50*10**18
                }),
                challengeDeposit: ERC3000Data.Collateral({
                    token: address(0xa117000000f279D81A1D3cc75430fAA017FA5A2e),
                    amount: 50*10**18
                }),
                resolver: address(0xFb072baA713B01cE944A0515c3e1e98170977dAF),
                rules: "QmV3pQWAqq8Un71SU1RRDVqwAGy7bBQUPaqLkqHwb9H3w7",
                maxCalldataSize: 100000
            }),
            Govern(payable(address(0xBe39E9CB1dAA8EE8838d6a93d360f7EA7b8373c2))) // Comp Govern Executor
        );
    }

    function deployTechSubDao() external returns (Govern techGovern, GovernQueue techQueue) {
        (techGovern, techQueue) = deployTechCommittee();

        emit TechSubDAODeployed(techGovern, techQueue);
    }
}
