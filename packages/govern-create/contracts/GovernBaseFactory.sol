/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "@aragon/govern-core/contracts/GovernRegistry.sol";

import "@aragon/govern-token/contracts/GovernTokenFactory.sol";
import "@aragon/govern-token/contracts/interfaces/IERC20.sol";
import "@aragon/govern-token/contracts/libraries/TokenLib.sol";

import "./core-factories/GovernFactory.sol";
import "./core-factories/GovernQueueFactory.sol";

contract GovernBaseFactory {
    address internal constant ANY_ADDR = address(-1);
    uint256 internal constant MAX_SCHEDULE_ACCESS_LIST_ALLOWED = 10;

    string private constant ERROR_SCHEDULE_LIST_EXCEEDED = "basefactory: schedule list exceeded";

    GovernFactory public governFactory;
    GovernQueueFactory public queueFactory;
    GovernTokenFactory public tokenFactory;
    GovernRegistry public registry;
    
    constructor(
        GovernRegistry _registry,
        GovernFactory _governFactory,
        GovernQueueFactory _queueFactory,
        GovernTokenFactory _tokenFactory
    ) public {
        governFactory = _governFactory;
        queueFactory = _queueFactory;
        tokenFactory = _tokenFactory;
        registry = _registry;
    }

    function newGovern(
        string calldata _name,
        TokenLib.TokenConfig calldata _token,
        ERC3000Data.Config calldata _config,
        address[] calldata _scheduleAccessList,
        bool _useProxies
    ) external returns (Govern govern, GovernQueue queue) {
        require(_scheduleAccessList.length <= MAX_SCHEDULE_ACCESS_LIST_ALLOWED, ERROR_SCHEDULE_LIST_EXCEEDED);

        bytes32 salt = _useProxies ? keccak256(abi.encodePacked(_name)) : bytes32(0);

        queue = queueFactory.newQueue(address(this), _config, salt);
        govern = governFactory.newGovern(queue, salt);

        IERC20 token = _token.tokenAddress;
        if (address(token) == address(0)) {
            (token,) = tokenFactory.newToken(
                govern,
                _token,
                _useProxies
            );
            // give base factory the permission so that it can change 
            // the config with new token in the same transaction
            queue.grant(queue.configure.selector, address(this));
            
            ERC3000Data.Config memory newConfig = ERC3000Data.Config({
                executionDelay: _config.executionDelay,
                scheduleDeposit: ERC3000Data.Collateral({
                    token: address(token),
                    amount: _config.scheduleDeposit.amount
                }),
                challengeDeposit: ERC3000Data.Collateral({
                    token: address(token),
                    amount: _config.challengeDeposit.amount
                }),
                resolver: _config.resolver,
                rules: _config.rules,
                maxCalldataSize: _config.maxCalldataSize
            });

            queue.configure(newConfig);
            queue.revoke(queue.configure.selector, address(this));
        }

        registry.register(govern, queue, token, _name, "");
        
        uint256 bulkSize = _scheduleAccessList.length == 0 ? 7 : 6 + _scheduleAccessList.length;
        ACLData.BulkItem[] memory items = new ACLData.BulkItem[](bulkSize);
        
        items[0] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.execute.selector, ANY_ADDR);
        items[1] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.challenge.selector, ANY_ADDR);
        items[2] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.configure.selector, address(govern));
        items[3] = ACLData.BulkItem(ACLData.BulkOp.Revoke, queue.ROOT_ROLE(), address(this));
        items[4] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.ROOT_ROLE(), address(govern));
        items[5] = ACLData.BulkItem(ACLData.BulkOp.Freeze, queue.ROOT_ROLE(), address(0));

        // If the schedule access list is empty, anyone can schedule
        // otherwise, only the addresses specified are allowed.
        if (_scheduleAccessList.length == 0) { 
            items[6] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.schedule.selector, ANY_ADDR);
        } else { 
            for (uint256 i = 0; i < _scheduleAccessList.length; i++) {
                items[6 + i] = ACLData.BulkItem(
                    ACLData.BulkOp.Grant, 
                    queue.schedule.selector, 
                    _scheduleAccessList[i]
                );
            }
        }

        queue.bulk(items);
    }
    
}
