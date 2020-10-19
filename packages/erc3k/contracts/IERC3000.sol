/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "./ERC3000Data.sol";
import "./IERC3000Executor.sol";

abstract contract IERC3000 {
    /**
     * @notice Schedules an action for execution, allowing for challenges and vetos on a defined time window
     * @param container A Container struct holding both the paylaod being scheduled for execution and
       the current configuration of the system
     */
    function schedule(ERC3000Data.Container memory container) virtual public returns (bytes32 containerHash);
    event Scheduled(bytes32 indexed containerHash, ERC3000Data.Payload payload, ERC3000Data.Collateral collateral);

    /**
     * @notice Executes an action after its execution delayed has passed and its state hasn't been altered by a challenge or veto
     * @param container A ERC3000Data.Container struct holding both the paylaod being scheduled for execution and
       the current configuration of the system
     * should be a MUST payload.executor.exec(payload.actions)
     */
    function execute(ERC3000Data.Container memory container) virtual public returns (bytes32 failureMap, bytes[] memory execResults);
    event Executed(bytes32 indexed containerHash, address indexed actor);

    /**
     * @notice Challenge a container in case its scheduling is illegal as per Config.rules. Pulls collateral and dispute fees from sender into contract
     * @param container A ERC3000Data.Container struct holding both the paylaod being scheduled for execution and
       the current configuration of the system
     * @param reason Hint for case reviewers as to why the scheduled container is illegal
     */
    function challenge(ERC3000Data.Container memory container, bytes memory reason) virtual public returns (uint256 resolverId);
    event Challenged(bytes32 indexed containerHash, address indexed actor, bytes reason, uint256 resolverId, ERC3000Data.Collateral collateral);

    /**
     * @notice Apply arbitrator's ruling over a challenge once it has come to a final ruling
     * @param container A ERC3000Data.Container struct holding both the paylaod being scheduled for execution and
       the current configuration of the system
     * @param resolverId disputeId in the arbitrator in which the dispute over the container was created
     */
    function resolve(ERC3000Data.Container memory container, uint256 resolverId) virtual public returns (bytes32 failureMap, bytes[] memory execResults);
    event Resolved(bytes32 indexed containerHash, address indexed actor, bool approved);

    /**
     * @notice Apply arbitrator's ruling over a challenge once it has come to a final ruling
     * @param payloadHash Hash of the payload being vetoed
     * @param config A ERC3000Data.Config struct holding the config attached to the payload being vetod
     */
    function veto(bytes32 payloadHash, ERC3000Data.Config memory config, bytes memory reason) virtual public;
    event Vetoed(bytes32 indexed containerHash, address indexed actor, bytes reason, ERC3000Data.Collateral collateral);

    /**
     * @notice Apply a new configuration for all *new* containers to be scheduled
     * @param config A ERC3000Data.Config struct holding all the new params that will control the queue
     */
    function configure(ERC3000Data.Config memory config) virtual public returns (bytes32 configHash);
    event Configured(bytes32 indexed containerHash, address indexed actor, ERC3000Data.Config config);
}