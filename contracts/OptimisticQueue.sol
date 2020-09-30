/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "erc3k/contracts/ERC3000.sol";

import "./lib/IArbitrable.sol";
import "./lib/MiniACL.sol";
import "./lib/SafeERC20.sol";

contract OptimisticQueue is ERC3000, IArbitrable, MiniACL {
    using SafeERC20 for ERC20;

    struct Item {
        uint64 executionTime;
        uint8 arbitratorRuling;
        address challenger;
    }

    mapping (bytes32 => Item) queue;
    mapping (IArbitrator => mapping (uint256 => bytes32)) disputeItem;
    uint256 public index;
    bytes32 public configHash;

    uint256 internal constant EXECUTED =   uint64(-1);
    uint256 internal constant CANCELLED =  uint64(-2);
    uint256 internal constant APPROVED =   uint64(-3);
    uint256 internal constant CHALLENGED = uint64(-4);

    address internal constant ETH = address(0);

    enum ExecutionState {
        None,
        Scheduled,
        Challenged,
        Approved,
        Cancelled,
        Executed
    }

    constructor(address _aclRoot, ERC3000Data.Config memory _initialConfig) MiniACL(_aclRoot) public {
        _setConfig(_initialConfig);
    }

    function schedule(ERC3000Data.Container memory _container)
        auth(this.schedule.selector)
        override public
        returns (bytes32 containerHash)
    {   
        require(_container.payload.nonce == index++, "queue: bad nonce");
        require(_container.payload.submitter == msg.sender, "queue: bad submitter");
        
        bytes32 _configHash = getConfigHash(_container.config);
        require(_configHash == configHash, "queue: bad config");

        uint256 execTime = block.timestamp + _container.config.executionDelay;
        containerHash = getContainerHash(getPayloadHash(_container.payload), _configHash);
        requireState(containerHash, ExecutionState.None);

        queue[containerHash].executionTime = uint64(execTime);

        ERC3000Data.Collateral memory collateral = _container.config.scheduleDeposit;
        _collectDeposit(msg.sender, collateral);
        // TODO: pay court tx fee

        emit Scheduled(containerHash, _container.payload, execTime, collateral);
    }
    
    function execute(ERC3000Data.Container memory _container)
        auth(this.execute.selector)
        override public
        returns (bytes[] memory execResults)
    {   
        bytes32 containerHash = getContainerHash(_container);
        requireState(containerHash, ExecutionState.Scheduled);

        require(queue[containerHash].executionTime <= uint64(block.timestamp), "queue: wait more");
        
        _setState(containerHash, ExecutionState.Executed);

        execResults = _container.payload.executor.exec(_container.payload.actions);
        _releaseDeposit(_container.payload.submitter, _container.config.scheduleDeposit);
        
        emit Executed(containerHash, msg.sender, execResults);
    }
    

    function challenge(bytes32 _payloadHash, ERC3000Data.Config memory _config, bytes memory _reason) auth(this.challenge.selector) override public {
        bytes32 containerHash = getContainerHash(_payloadHash, getConfigHash(_config));
        requireState(containerHash, ExecutionState.Scheduled);

        _setState(containerHash, ExecutionState.Challenged);
        queue[containerHash].challenger = msg.sender;
        
        uint256 disputeId;
        IArbitrator arbitrator;

        // TODO: create dispute

        disputeItem[arbitrator][disputeId] = containerHash;

        ERC3000Data.Collateral memory collateral = _config.challengeDeposit;
        _collectDeposit(msg.sender, collateral);

        emit Challenged(containerHash, msg.sender, _reason, collateral);
    }

    function veto(bytes32 _payloadHash, ERC3000Data.Config memory _config, bytes memory _reason) auth(this.veto.selector) override public {
        bytes32 containerHash = getContainerHash(_payloadHash, getConfigHash(_config));
        requireState(containerHash, ExecutionState.Scheduled);

        _setState(containerHash, ExecutionState.Cancelled);

        emit Vetoed(containerHash, msg.sender, _reason, _config.vetoDeposit);
    }

    function configure(ERC3000Data.Config memory _config)
        auth(this.configure.selector)
        override public
        returns (bytes32)
    {
        return _setConfig(_config);
    }

    // Arbitrable
    function rule(uint256 _disputeId, uint256 _ruling) override external {
        bytes32 containerHash = disputeItem[IArbitrator(msg.sender)][_disputeId];
        requireState(containerHash, ExecutionState.Challenged);

        /*
        bool isApproved;
        _setState();
        */
    }

    function submitEvidence(uint256, bytes calldata, bool) override external {
        revert("queue: evidence");
    }

    function supportsInterface(bytes4 _interfaceId) override public pure returns (bool) {
        return _interfaceId == ARBITRABLE_INTERFACE_ID || super.supportsInterface(_interfaceId);
    }

    function _setState(bytes32 _containerHash, ExecutionState _state) internal {
        queue[_containerHash].executionTime = encodeState(_state);
    }

    function _setConfig(ERC3000Data.Config memory _config) internal returns (bytes32) {
        configHash = getConfigHash(_config);

        emit Configured(configHash, msg.sender, _config);

        return configHash;
    }

    function _collectDeposit(address _from, ERC3000Data.Collateral memory _collateral) internal {
        if (_collateral.token == ETH) {
            require(msg.value == _collateral.amount, "queue: bad get eth");
        } else {
            ERC20 token = ERC20(_collateral.token);
            require(token.safeTransferFrom(_from, msg.sender, _collateral.amount), "queue: bad get token");
        }
    }

    function _releaseDeposit(address _to, ERC3000Data.Collateral memory _collateral) internal {
        if (_collateral.token == ETH) {
            address payable to = address(uint160(_to));
            (bool ok,) = to.call{ value: _collateral.amount }("");
            require(ok, "queue: bad send eth");
        } else {
            ERC20 token = ERC20(_collateral.token);
            require(token.safeTransfer(_to, _collateral.amount), "queue: bad send token");
        }
    }

    function getContainerHash(ERC3000Data.Container memory _container) internal view returns (bytes32) {
        return getContainerHash(getPayloadHash(_container.payload), getConfigHash(_container.config));
    } 

    function getContainerHash(bytes32 _payloadHash, bytes32 _configHash) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(this, _payloadHash, _configHash));
    }

    function getPayloadHash(ERC3000Data.Payload memory _payload) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_payload.nonce, _payload.submitter, _payload.executor, keccak256(abi.encode(_payload.actions))));
    }

    function getConfigHash(ERC3000Data.Config memory _config) internal pure returns (bytes32) {
        return keccak256(abi.encode(_config));
    }

    function requireState(bytes32 _containerHash, ExecutionState _requiredState) internal view {
        require(decodeState(queue[_containerHash].executionTime) == _requiredState, "queue: bad state");
    }

    function decodeState(uint64 _execTime) internal pure returns (ExecutionState) {
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
