/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "./IERC3000Executor.sol";

library ERC3000Data {
    // TODO: come up with a non-shitty name
    struct Container {
        Payload payload;
        Config config;
    }

    // WARN: Always remember to change the 'hash' function if modifying the struct
    struct Payload {
        uint256 nonce;
        uint256 executionTime;
        address submitter;
        IERC3000Executor executor;
        Action[] actions;
        bytes32 allowFailuresMap;
        bytes proof;
    }

    struct Action {
        address to;
        uint256 value;
        bytes data;
    }

    struct Config {
        uint256 executionDelay;
        Collateral scheduleDeposit;
        Collateral challengeDeposit;
        address resolver;
        bytes rules;
    }

    struct Collateral {
        address token;
        uint256 amount;
    }

    function containerHash(bytes32 payloadHash, bytes32 configHash) internal view returns (bytes32) {
        uint chainId;
        assembly {
            chainId := chainid()
        }

        return keccak256(abi.encodePacked("erc3k-v1", address(this), chainId, payloadHash, configHash));
    }

    function hash(Container memory container) internal view returns (bytes32) {
        return containerHash(hash(container.payload), hash(container.config));
    }

    function hash(Payload memory payload) internal pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                payload.nonce,
                payload.executionTime,
                payload.submitter,
                payload.executor,
                keccak256(abi.encode(payload.actions)),
                payload.allowFailuresMap,
                keccak256(payload.proof)
            )
        );
    }

    function hash(Config memory config) internal pure returns (bytes32) {
        return keccak256(abi.encode(config));
    }
}
