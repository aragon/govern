/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "./IERC3000Executor.sol";

library ERC3000Data {
    // TODO: come up with a non-shitty name
    // Note: Maybe payload is a better fit for this while renaming the current "payload" struct to something else
    struct Container {
        Payload payload;
        Config config;
    }

    struct Payload {
        uint256 nonce;
        // Note: what could be a use case that would require an extra delay?
        uint256 executionTime;
        address submitter;
        IERC3000Executor executor;
        Action[] actions;
        bytes proof;
    }

    struct Action {
        address to;
        uint256 value;
        bytes data;
    }

    struct Config {
        uint256 executionDelay;
        // Note: I'd call these variables "xCollateral" or rename the struct to "Deposit", I prefer the first option
        Collateral scheduleDeposit;
        Collateral challengeDeposit;
        Collateral vetoDeposit;
        // Note: why not arbitrator?
        address resolver;
        bytes rules;
    }

    struct Collateral {
        address token;
        uint256 amount;
    }

    function containerHash(bytes32 payloadHash, bytes32 configHash) internal view returns (bytes32) {
        // Note: Split ERC name from version name
        return keccak256(abi.encodePacked("erc3k-v1", this, payloadHash, configHash));
    }

    function hash(Container memory container) internal view returns (bytes32) {
        return containerHash(hash(container.payload), hash(container.config));
    }

    function hash(Payload memory payload) internal pure returns (bytes32) {
        // Note: I'd try to follow the same order defined in the struct to be consistent
        return keccak256(
            abi.encodePacked(
                payload.nonce,
                payload.submitter,
                payload.executor,
                keccak256(abi.encode(payload.actions)),
                keccak256(payload.proof)
            )
        );
    }

    function hash(Config memory config) internal pure returns (bytes32) {
        return keccak256(abi.encode(config));
    }
}
