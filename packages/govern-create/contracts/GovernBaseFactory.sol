/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "@aragon/govern-core/contracts/GovernRegistry.sol";

import "@aragon/govern-token/contracts/GovernTokenFactory.sol";
import "@aragon/govern-token/contracts/interfaces/IERC20.sol";
import "@aragon/govern-token/contracts/libraries/TokenConfig.sol";

import "./core-factories/GovernFactory.sol";
import "./core-factories/GovernQueueFactory.sol";

contract GovernBaseFactory {
    address internal constant ANY_ADDR = address(-1);

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
        TokenConfig.Token calldata _token,
        ERC3000Data.Config calldata _config,
        address[] calldata scheduleAccessList,
        bool _useProxies
    ) external returns (Govern govern, GovernQueue queue) {
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
        }

        registry.register(govern, queue, token, _name, "");
        
        ACLData.BulkItem[] memory items = new ACLData.BulkItem[](6 + scheduleAccessList.length);
        
        items[0] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.execute.selector, ANY_ADDR);
        items[1] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.challenge.selector, ANY_ADDR);
        items[2] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.configure.selector, address(govern));
        items[3] = ACLData.BulkItem(ACLData.BulkOp.Revoke, queue.ROOT_ROLE(), address(this));
        items[4] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.ROOT_ROLE(), address(govern));
        items[5] = ACLData.BulkItem(ACLData.BulkOp.Freeze, queue.ROOT_ROLE(), address(0));

        // If the length is 0, it means anyone can start scheduling, otherwise
        // we only allow schedule be called by specified scheduleAccessList addresses
        if(scheduleAccessList.length == 0) {
            items[6] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.schedule.selector, ANY_ADDR);
        }else{
            for (uint256 i = 0; i < scheduleAccessList.length; i++) {
                items[6 + i] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.schedule.selector, scheduleAccessList[i]);
            }
        }


        queue.bulk(items);
    }
    
}
