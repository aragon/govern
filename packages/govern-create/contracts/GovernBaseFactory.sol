/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "@aragon/govern-core/contracts/GovernRegistry.sol";

import "@aragon/govern-token/contracts/GovernTokenFactory.sol";
import "@aragon/govern-token/contracts/interfaces/IERC20.sol";

import "./core-factories/GovernFactory.sol";
import "./core-factories/GovernQueueFactory.sol";

contract GovernBaseFactory {
    address internal constant ANY_ADDR = address(-1);

    GovernFactory public governFactory;
    GovernQueueFactory public queueFactory;
    GovernTokenFactory public tokenFactory;
    GovernRegistry public registry;

    struct Token {
        IERC20 tokenAddress;
        uint8  tokenDecimals;
        string tokenName;
        string tokenSymbol;
    }

    struct Config {
        address resolver;
    }

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

    function newGovernWithoutConfig(
        string calldata _name,
        Token calldata _token,
        Config calldata _config,
        bool _useProxies
    ) external returns (Govern govern, GovernQueue queue) {
        bytes32 salt = _useProxies ? keccak256(abi.encodePacked(_name)) : bytes32(0);

        queue = queueFactory.newQueue(address(this), initialConfig(_config.resolver), salt);
        govern = governFactory.newGovern(queue, salt);

        IERC20 token = _token.tokenAddress;
        if (address(token) == address(0)) {
            (token,) = tokenFactory.newToken(
                govern,
                _token.tokenName,
                _token.tokenSymbol,
                _token.tokenDecimals,
                msg.sender,
                1 * 10 ** 18,
                _useProxies
            );
        }

        registry.register(govern, queue, token, _name, "");

        ACLData.BulkItem[] memory items = new ACLData.BulkItem[](6);
        items[0] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.schedule.selector, ANY_ADDR);
        items[1] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.execute.selector, ANY_ADDR);
        items[2] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.challenge.selector, ANY_ADDR);
        items[3] = ACLData.BulkItem(ACLData.BulkOp.Grant, queue.configure.selector, address(govern));
        items[4] = ACLData.BulkItem(ACLData.BulkOp.Revoke, queue.ROOT_ROLE(), address(this));
        items[5] = ACLData.BulkItem(ACLData.BulkOp.Freeze, queue.ROOT_ROLE(), address(0));
        
        queue.bulk(items);
    }

    function initialConfig(address _resolver) internal pure returns (ERC3000Data.Config memory) {
        ERC3000Data.Collateral memory noCollateral;
        return ERC3000Data.Config(
            3600, // how many seconds to wait before being able to call `execute`.
            noCollateral, // no collateral by default
            noCollateral, // no collateral by default
            _resolver, // the initial resolver for the disputes
            "", // initial rules property
            100000 // initial maxCalldatasize
        );
    }
}
