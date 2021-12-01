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

contract ANDAOFactory {
    address internal constant ANY_ADDR = address(-1);

    GovernFactory public governFactory;
    GovernQueueFactory public queueFactory;
    GovernRegistry public registry;
    Govern public mainDAOExecutor;

    event SubDAOsDeployed(Govern compGovern, GovernQueue indexed compQueue, Govern execGovern, GovernQueue indexed execQueue);
    
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
        uint256 bulkSize = 7;
        if (address(vetoExecutor) != address(0)) { 
            bulkSize = 8;
        }

        ACLData.BulkItem[] memory queueItems = new ACLData.BulkItem[](bulkSize);
        queueItems[0] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.execute.selector, ANY_ADDR);
        queueItems[1] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.challenge.selector, ANY_ADDR);
        queueItems[2] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.configure.selector, address(govern));
        queueItems[3] = ACLData.BulkItem(ACLData.BulkOp.Revoke, queue.ROOT_ROLE(), address(this));
        queueItems[4] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.ROOT_ROLE(), address(govern));
        queueItems[5] = ACLData.BulkItem(ACLData.BulkOp.Freeze, queue.ROOT_ROLE(), address(0));
        queueItems[6] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.schedule.selector, ANY_ADDR);

        if (address(vetoExecutor) != address(0)) { 
            queueItems[7] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.veto.selector, address(vetoExecutor));
        }

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

    function deployExecutiveCommittee(Govern compGovern) internal returns (Govern govern, GovernQueue queue) {
        return _createGovern(
            IERC20(0x613a126c20632c99afD01B044fe13e97b76eeb5A), // EXE COMMITTEE TOKEN
            "an_exec_dao",
            ERC3000Data.Config({
                executionDelay: 604800, // 7 days
                scheduleDeposit: ERC3000Data.Collateral({
                    token: address(0xa117000000f279D81A1D3cc75430fAA017FA5A2e),
                    amount: 50
                }),
                challengeDeposit: ERC3000Data.Collateral({
                    token: address(0xa117000000f279D81A1D3cc75430fAA017FA5A2e),
                    amount: 50
                }),
                resolver: address(0xFb072baA713B01cE944A0515c3e1e98170977dAF),
                rules: "QmV3pQWAqq8Un71SU1RRDVqwAGy7bBQUPaqLkqHwb9H3w7",
                maxCalldataSize: 100000
            }),
            compGovern
        );
    }

    function deployComplianceCommittee() internal returns (Govern govern, GovernQueue queue) {
        return _createGovern(
            IERC20(0x8aA971084Ed42fc3452D34c5AeC4878c28DD7cD0), // CMPL COMMITTEE TOKEN
            "an_compliance_dao",
            ERC3000Data.Config({
                executionDelay: 10800, // 3 hours
                scheduleDeposit: ERC3000Data.Collateral({
                    token: address(0xa117000000f279D81A1D3cc75430fAA017FA5A2e),
                    amount: 50
                }),
                challengeDeposit: ERC3000Data.Collateral({
                    token: address(0xa117000000f279D81A1D3cc75430fAA017FA5A2e),
                    amount: 50
                }),
                resolver: address(0xFb072baA713B01cE944A0515c3e1e98170977dAF),
                rules: "QmV3pQWAqq8Un71SU1RRDVqwAGy7bBQUPaqLkqHwb9H3w7",
                maxCalldataSize: 100000
            }),
            Govern(0)
        );
    }

    function deployANSubDAOs() external returns (Govern compGovern, GovernQueue compQueue, Govern execGovern, GovernQueue execQueue) {
        (compGovern, compQueue) = deployComplianceCommittee();
        (execGovern, execQueue) = deployExecutiveCommittee(compGovern);

        emit SubDAOsDeployed(compGovern, compQueue, execGovern, execQueue);
    }
}
