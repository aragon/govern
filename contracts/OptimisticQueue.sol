/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "erc3k/contracts/ERC3000.sol";

import "./lib/IArbitrable.sol";
import "./lib/DepositLib.sol";
import "./lib/MiniACL.sol";
import "./lib/SafeERC20.sol";

contract OptimisticQueue is ERC3000, IArbitrable, MiniACL {
    using ERC3000Data for *;
    using DepositLib for ERC3000Data.Collateral;

    struct Item {
        uint64 executionTime;
        uint8 arbitratorRuling;
        address challenger;
    }

    mapping(bytes32 => Item) queue;
    mapping(IArbitrator => mapping(uint256 => bytes32)) disputeItem;
    uint256 public index;
    bytes32 public configHash;

    uint256 internal constant EXECUTED = uint64(-1);
    uint256 internal constant CANCELLED = uint64(-2);
    uint256 internal constant APPROVED = uint64(-3);
    uint256 internal constant CHALLENGED = uint64(-4);

    enum ExecutionState {
        None,
        Scheduled,
        Challenged,
        Approved,
        Cancelled,
        Executed
    }

    constructor(address _aclRoot, ERC3000Data.Config memory _initialConfig)
        public
        MiniACL(_aclRoot)
    {
        _setConfig(_initialConfig);
    }

    function schedule(ERC3000Data.Container memory _container)
        public
        override
        auth(this.schedule.selector)
        returns (bytes32 containerHash)
    {
        require(_container.payload.nonce == index++, "queue: bad nonce");
        require(
            _container.payload.submitter == msg.sender,
            "queue: bad submitter"
        );

        bytes32 _configHash = _container.config.hash();
        require(_configHash == configHash, "queue: bad config");

        uint256 execTime = block.timestamp + _container.config.executionDelay;
        containerHash = ERC3000Data.containerHash(
            _container.payload.hash(),
            _configHash
        );
        requireState(containerHash, ExecutionState.None);

        queue[containerHash].executionTime = uint64(execTime);

        ERC3000Data.Collateral memory collateral = _container
            .config
            .scheduleDeposit;
        collateral.collectFrom(msg.sender);
        // TODO: pay court tx fee

        emit Scheduled(containerHash, _container.payload, execTime, collateral);
    }

    function execute(ERC3000Data.Container memory _container)
        public
        override
        auth(this.execute.selector)
        returns (bytes[] memory execResults)
    {
        bytes32 containerHash = _container.hash();
        requireState(containerHash, ExecutionState.Scheduled);

        require(
            queue[containerHash].executionTime <= uint64(block.timestamp),
            "queue: wait more"
        );

        _setState(containerHash, ExecutionState.Executed);

        execResults = _container.payload.executor.exec(
            _container.payload.actions
        );
        _container.config.scheduleDeposit.releaseTo(
            _container.payload.submitter
        );

        emit Executed(containerHash, msg.sender, execResults);
    }

    function challenge(
        bytes32 _payloadHash,
        ERC3000Data.Config memory _config,
        bytes memory _reason
    ) public override auth(this.challenge.selector) {
        bytes32 containerHash = ERC3000Data.containerHash(
            _payloadHash,
            _config.hash()
        );
        requireState(containerHash, ExecutionState.Scheduled);

        _setState(containerHash, ExecutionState.Challenged);
        queue[containerHash].challenger = msg.sender;

        uint256 disputeId;
        IArbitrator arbitrator;

        // TODO: create dispute

        disputeItem[arbitrator][disputeId] = containerHash;

        ERC3000Data.Collateral memory collateral = _config.challengeDeposit;
        collateral.collectFrom(msg.sender);

        emit Challenged(containerHash, msg.sender, _reason, collateral);
    }

    function veto(
        bytes32 _payloadHash,
        ERC3000Data.Config memory _config,
        bytes memory _reason
    ) public override auth(this.veto.selector) {
        bytes32 containerHash = ERC3000Data.containerHash(
            _payloadHash,
            _config.hash()
        );
        requireState(containerHash, ExecutionState.Scheduled);

        _setState(containerHash, ExecutionState.Cancelled);

        emit Vetoed(containerHash, msg.sender, _reason, _config.vetoDeposit);
    }

    function configure(ERC3000Data.Config memory _config)
        public
        override
        auth(this.configure.selector)
        returns (bytes32)
    {
        return _setConfig(_config);
    }

    // Arbitrable
    function rule(uint256 _disputeId, uint256) external override {
        bytes32 containerHash = disputeItem[IArbitrator(
            msg.sender
        )][_disputeId];
        requireState(containerHash, ExecutionState.Challenged);

        /*
        bool isApproved;
        _setState();
        */
    }

    function submitEvidence(
        uint256,
        bytes calldata,
        bool
    ) external override {
        revert("queue: evidence");
    }

    function supportsInterface(bytes4 _interfaceId)
        public
        override
        pure
        returns (bool)
    {
        return
            _interfaceId == ARBITRABLE_INTERFACE_ID ||
            super.supportsInterface(_interfaceId);
    }

    function _setState(bytes32 _containerHash, ExecutionState _state) internal {
        queue[_containerHash].executionTime = encodeState(_state);
    }

    function _setConfig(ERC3000Data.Config memory _config)
        internal
        returns (bytes32)
    {
        configHash = _config.hash();

        emit Configured(configHash, msg.sender, _config);

        return configHash;
    }

    function requireState(bytes32 _containerHash, ExecutionState _requiredState)
        internal
        view
    {
        require(
            decodeState(queue[_containerHash].executionTime) == _requiredState,
            "queue: bad state"
        );
    }

    function decodeState(uint64 _execTime)
        internal
        pure
        returns (ExecutionState)
    {
        if (_execTime == 0) return ExecutionState.None;
        if (_execTime < CHALLENGED) return ExecutionState.Scheduled;
        if (_execTime == CHALLENGED) return ExecutionState.Challenged;
        if (_execTime == APPROVED) return ExecutionState.Approved;
        if (_execTime == CANCELLED) return ExecutionState.Cancelled;
        else return ExecutionState.Executed;
    }

    function encodeState(ExecutionState _state) internal pure returns (uint64) {
        if (_state == ExecutionState.None) return 0;
        if (_state == ExecutionState.Challenged) return uint64(CHALLENGED);
        if (_state == ExecutionState.Approved) return uint64(APPROVED);
        if (_state == ExecutionState.Cancelled) return uint64(CANCELLED);
        if (_state == ExecutionState.Executed) return uint64(EXECUTED);
        assert(false); // code should never try to encode a Scheduled state using this
    }
}
