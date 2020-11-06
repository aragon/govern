/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8; // TODO: reconsider compiler version before production release
pragma experimental ABIEncoderV2; // required for passing structs in calldata (fairly secure at this point)

import "erc3k/contracts/IERC3000.sol";

import "@aragon/govern-contract-utils/contracts/protocol/IArbitrable.sol";
import "@aragon/govern-contract-utils/contracts/deposits/DepositLib.sol";
import "@aragon/govern-contract-utils/contracts/acl/ACL.sol";
import "@aragon/govern-contract-utils/contracts/adaptative-erc165/AdaptativeERC165.sol";
import "@aragon/govern-contract-utils/contracts/erc20/SafeERC20.sol";

library GovernQueueStateLib {
    enum State {
        None,
        Scheduled,
        Challenged,
        Approved,
        Rejected,
        Cancelled,
        Executed
    }

    struct Item {
        State state;
    }

    function checkState(Item storage _item, State _requiredState) internal view {
        require(_item.state == _requiredState, "queue: bad state");
    }

    function setState(Item storage _item, State _state) internal {
        _item.state = _state;
    }

    function checkAndSetState(Item storage _item, State _fromState, State _toState) internal {
        checkState(_item, _fromState);
        setState(_item, _toState);
    }
}

contract GovernQueue is IERC3000, AdaptativeERC165, IArbitrable, ACL {
    // Syntax sugar to enable method-calling syntax on types
    using ERC3000Data for *;
    using DepositLib for ERC3000Data.Collateral;
    using GovernQueueStateLib for GovernQueueStateLib.Item;
    using SafeERC20 for ERC20;

    // Permanent state
    bytes32 public configHash; // keccak256 hash of the current ERC3000Data.Config
    uint256 public nonce; // number of scheduled payloads so far
    mapping (bytes32 => GovernQueueStateLib.Item) public queue; // container hash -> execution state

    // Temporary state
    mapping (bytes32 => address) public challengerCache; // container hash -> challenger addr (used after challenging and before resolution implementation)
    mapping (IArbitrator => mapping (uint256 => bytes32)) public disputeItemCache; // arbitrator addr -> dispute id -> container hash (used between dispute creation and ruling)

    /**
     * @param _aclRoot account that will be given root permissions on ACL (commonly given to factory)
     * @param _initialConfig initial configuration parameters
     */
    constructor(address _aclRoot, ERC3000Data.Config memory _initialConfig)
        public
        ACL(_aclRoot) // note that this contract directly derives from ACL (ACL is local to contract and not global to system in Govern)
    {
        initialize(_aclRoot, _initialConfig);
    }

    function initialize(address _aclRoot, ERC3000Data.Config memory _initialConfig) public initACL(_aclRoot) onlyInit("queue") {
        _setConfig(_initialConfig);
        _registerStandard(ARBITRABLE_INTERFACE_ID);
        _registerStandard(ERC3000_INTERFACE_ID);
    }

     /**
     * @notice Schedules an action for execution, allowing for challenges and vetos on a defined time window. Pulls collateral from submitter into contract.
     * @param _container A ERC3000Data.Container struct holding both the paylaod being scheduled for execution and
       the current configuration of the system
     */
    function schedule(ERC3000Data.Container memory _container) // TO FIX: Container is in memory and function has to be public to avoid an unestrutable solidity crash
        public
        override
        auth(this.schedule.selector) // note that all functions in this contract are ACL protected (commonly some of them will be open for any addr to perform)
        returns (bytes32 containerHash)
    {   
        // prevent griefing by front-running (the same container is sent by two different people and one must be challenged)
        require(_container.payload.nonce == ++nonce, "queue: bad nonce");
        // hash using ERC3000Data.hash(ERC3000Data.Config)
        bytes32 _configHash = _container.config.hash();
        // ensure that the hash of the config passed in the container matches the current config (implicit agreement approval by scheduler)
        require(_configHash == configHash, "queue: bad config");
        // ensure that the time delta to the execution timestamp provided in the payload is at least after the config's execution delay
        require(_container.payload.executionTime >= block.timestamp + _container.config.executionDelay, "queue: bad delay");
        // ensure that the submitter of the payload is also the sender of this call
        require(_container.payload.submitter == msg.sender, "queue: bad submitter");

        containerHash = ERC3000Data.containerHash(_container.payload.hash(), _configHash);
        queue[containerHash].checkAndSetState(
            GovernQueueStateLib.State.None, // ensure that the state for this container is None
            GovernQueueStateLib.State.Scheduled // and if so perform a state transition to Scheduled
        );
        // we don't need to save any more state about the container in storage
        // we just authenticate the hash and assign it a state, since all future
        // actions regarding the container will need to provide it as a witness
        // all witnesses are logged from this contract at least once, so the 
        // trust assumption should be the same as storing all on-chain (move complexity to clients)

        ERC3000Data.Collateral memory collateral = _container.config.scheduleDeposit;
        collateral.collectFrom(_container.payload.submitter); // pull collateral from submitter (requires previous approval)

        // TODO: pay court tx fee

        // emit an event to ensure data availability of all state that cannot be otherwise fetched (see how config isn't emitted since an observer should already have it)
        emit Scheduled(containerHash, _container.payload);
    }

    /**
     * @notice Executes an action after its execution delayed has passed and its state hasn't been altered by a challenge or veto
     * @param _container A ERC3000Data.Container struct holding both the paylaod being scheduled for execution and
       the current configuration of the system
     */
    function execute(ERC3000Data.Container memory _container)
        public
        override
        auth(this.execute.selector) // in most instances this will be open for any addr, but leaving configurable for flexibility
        returns (bytes32 failureMap, bytes[] memory execResults)
    {
        // ensure enough time has passed
        require(uint64(block.timestamp) >= _container.payload.executionTime, "queue: wait more");

        bytes32 containerHash = _container.hash();
        queue[containerHash].checkAndSetState(
            GovernQueueStateLib.State.Scheduled, // note that we will revert here if the container wasn't previously scheduled
            GovernQueueStateLib.State.Executed
        );

        _container.config.scheduleDeposit.releaseTo(_container.payload.submitter); // release collateral to executor

        return _execute(_container.payload, containerHash);
    }

    /**
     * @notice Challenge a container in case its scheduling is illegal as per Config.rules. Pulls collateral and dispute fees from sender into contract
     * @param _container A ERC3000Data.Container struct holding both the paylaod being scheduled for execution and
       the current configuration of the system
     * @param _reason Hint for case reviewers as to why the scheduled container is illegal
     */
    function challenge(ERC3000Data.Container memory _container, bytes memory _reason) auth(this.challenge.selector) override public returns (uint256 disputeId) {
        bytes32 containerHash = _container.hash();
        challengerCache[containerHash] = msg.sender; // cache challenger address while it is needed
        queue[containerHash].checkAndSetState(
            GovernQueueStateLib.State.Scheduled,
            GovernQueueStateLib.State.Challenged
        );

        ERC3000Data.Collateral memory collateral = _container.config.challengeDeposit;
        collateral.collectFrom(msg.sender); // pull challenge collateral from sender

        // create dispute on arbitrator
        IArbitrator arbitrator = IArbitrator(_container.config.resolver);
        (address recipient, ERC20 feeToken, uint256 feeAmount) = arbitrator.getDisputeFees();
        require(feeToken.safeTransferFrom(msg.sender, address(this), feeAmount), "queue: bad fee pull");
        require(feeToken.safeApprove(recipient, feeAmount), "queue: bad approve");
        disputeId = arbitrator.createDispute(2, abi.encode(_container)); // create dispute sending full container ABI encoded (could prob just send payload to save gas)
        require(feeToken.safeApprove(recipient, 0), "queue: bad reset"); // for security with non-compliant tokens (that fail on non-zero to non-zero approvals)

        // submit both arguments as evidence and close evidence period. no more evidence can be submitted and a settlement can't happen (could happen off-protocol)
        emit EvidenceSubmitted(arbitrator, disputeId, _container.payload.submitter, _container.payload.proof, true);
        emit EvidenceSubmitted(arbitrator, disputeId, msg.sender, _reason, true);
        arbitrator.closeEvidencePeriod(disputeId);

        disputeItemCache[arbitrator][disputeId] = containerHash; // cache a relation between disputeId and containerHash while needed

        emit Challenged(containerHash, msg.sender, _reason, disputeId, collateral);
    }

    /**
     * @notice Apply arbitrator's ruling over a challenge once it has come to a final ruling
     * @param _container A ERC3000Data.Container struct holding both the paylaod being scheduled for execution and
       the current configuration of the system
     * @param _disputeId disputeId in the arbitrator in which the dispute over the container was created
     */
    function resolve(ERC3000Data.Container memory _container, uint256 _disputeId) override public returns (bytes32 failureMap, bytes[] memory execResults) {
        bytes32 containerHash = _container.hash();
        if (queue[containerHash].state == GovernQueueStateLib.State.Challenged) {
            // will re-enter in `rule`, `rule` will perform state transition depending on ruling
            IArbitrator(_container.config.resolver).executeRuling(_disputeId);
        } // else continue, as we must 

        GovernQueueStateLib.State state = queue[containerHash].state;

        emit Resolved(containerHash, msg.sender, state == GovernQueueStateLib.State.Approved);

        if (state == GovernQueueStateLib.State.Approved) {
            return executeApproved(_container);
        }

        require(state == GovernQueueStateLib.State.Rejected, "queue: unresolved");
        settleRejection(_container);
        return (bytes32(0), new bytes[](0));
    }

    function veto(bytes32 _containerHash, bytes memory _reason) auth(this.veto.selector) override public {
        queue[_containerHash].checkAndSetState(
            GovernQueueStateLib.State.Scheduled,
            GovernQueueStateLib.State.Cancelled
        );

        emit Vetoed(_containerHash, msg.sender, _reason);
    }

    /**
     * @notice Apply a new configuration for all *new* containers to be scheduled
     * @param _config A ERC3000Data.Config struct holding all the new params that will control the queue
     */
    function configure(ERC3000Data.Config memory _config)
        public
        override
        auth(this.configure.selector)
        returns (bytes32)
    {
        return _setConfig(_config);
    }

    // Finalization functions
    // In the happy path, they are not externally called (triggered from resolve -> rule -> executeApproved | settleRejection), but left public for security

    function executeApproved(ERC3000Data.Container memory _container) public returns (bytes32 failureMap, bytes[] memory execResults) {
        bytes32 containerHash = _container.hash();
        queue[containerHash].checkAndSetState(
            GovernQueueStateLib.State.Approved,
            GovernQueueStateLib.State.Executed
        );

        // release all collateral to submitter
        _container.config.scheduleDeposit.releaseTo(_container.payload.submitter);
        _container.config.challengeDeposit.releaseTo(_container.payload.submitter);

        challengerCache[containerHash] = address(0); // release state, refund gas, no longer needed in state

        return _execute(_container.payload, containerHash);
    }

    function settleRejection(ERC3000Data.Container memory _container) public {
        bytes32 containerHash = _container.hash();
        queue[containerHash].checkAndSetState(
            GovernQueueStateLib.State.Rejected,
            GovernQueueStateLib.State.Cancelled
        );

        address challenger = challengerCache[containerHash];

        // release all collateral to challenger
        _container.config.scheduleDeposit.releaseTo(challenger);
        _container.config.challengeDeposit.releaseTo(challenger);
        challengerCache[containerHash] = address(0); // release state, refund gas, no longer needed in state
    }

    // Arbitrable

    function rule(uint256 _disputeId, uint256 _ruling) override external {
        // implicit check that msg.sender was actually arbitrating a dispute over this container
        IArbitrator arbitrator = IArbitrator(msg.sender);
        bytes32 containerHash = disputeItemCache[arbitrator][_disputeId];
        queue[containerHash].checkAndSetState(
            GovernQueueStateLib.State.Challenged,
            _ruling == ALLOW_RULING ? GovernQueueStateLib.State.Approved : GovernQueueStateLib.State.Rejected
        );
        disputeItemCache[arbitrator][_disputeId] = bytes32(0); // refund gas, no longer needed in state

        emit Ruled(arbitrator, _disputeId, _ruling);
    }

    function submitEvidence(
        uint256,
        bytes calldata,
        bool
    ) external override {
        revert("queue: evidence");
    }

    // Internal

    function _execute(ERC3000Data.Payload memory _payload, bytes32 _containerHash) internal returns (bytes32, bytes[] memory) {
        emit Executed(_containerHash, msg.sender);
        return _payload.executor.exec(_payload.actions, _payload.allowFailuresMap, _containerHash);
    }

    function _setConfig(ERC3000Data.Config memory _config)
        internal
        returns (bytes32)
    {
        configHash = _config.hash();

        emit Configured(configHash, msg.sender, _config);

        return configHash;
    }
}
