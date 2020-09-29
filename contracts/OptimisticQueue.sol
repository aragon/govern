/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "erc3k/contracts/ERC3000.sol";

import "./lib/SafeERC20.sol";
import "./lib/MiniACL.sol";

contract OptimisticQueue is ERC3000, MiniACL {
    using SafeERC20 for ERC20;

    uint256 public index;
    bytes32 public configHash;
    mapping (bytes32 => uint256) public executionTime;

    uint256 internal constant EXECUTED =   uint256(-1);
    uint256 internal constant CANCELLED =  uint256(-2);
    uint256 internal constant CHALLENGED = uint256(-3);

    address internal constant ETH = address(0);

    enum ExecutionState {
        None,
        Scheduled,
        Challenged,
        Cancelled,
        Executed
    }

    constructor(address _aclRoot, ERC3000Data.Config memory _initialConfig) MiniACL(_aclRoot) public {
        _setConfig(_initialConfig);
    }

    function schedule(ERC3000Data.Container memory _container, bytes memory _proof)
        auth(this.schedule.selector)
        override public
        returns (bytes32 containerHash)
    {   
        require(_container.payload.nonce == index++, "queue: bad nonce");
        require(_container.payload.submitter == msg.sender, "queue: bad submitter");
        
        bytes32 _configHash = keccak256(abi.encode(_container.config));
        require(_configHash == configHash, "queue: bad config");

        uint256 execTime = block.timestamp + _container.config.executionDelay;
        containerHash = getContainerHash(getPayloadHash(_container.payload), _configHash);
        requireState(containerHash, ExecutionState.None);

        executionTime[containerHash] = execTime;

        ERC3000Data.Collateral memory collateral = _container.config.scheduleDeposit;
        _collectDeposit(msg.sender, collateral);
        // TODO: pay court tx fee

        emit Scheduled(containerHash, _container.payload, _proof, execTime, collateral);
    }
    
    function execute(ERC3000Data.Container memory _container)
        auth(this.execute.selector)
        override public
        returns (bytes[] memory execResults)
    {   
        bytes32 containerHash = getContainerHash(_container);
        requireState(containerHash, ExecutionState.Scheduled);

        require(executionTime[containerHash] <= block.timestamp, "queue: wait more");
        
        _setState(containerHash, ExecutionState.Executed);

        execResults = _container.payload.executor.exec(_container.payload.actions);
        _releaseDeposit(_container.payload.submitter, _container.config.scheduleDeposit);
        
        emit Executed(containerHash, msg.sender, execResults);
    }
    

    function challenge(bytes32 _payloadHash, ERC3000Data.Config memory _config, bytes memory _reason) auth(this.challenge.selector) override public {
        bytes32 containerHash = getContainerHash(_payloadHash, getConfigHash(_config));
        requireState(containerHash, ExecutionState.Scheduled);

        _setState(containerHash, ExecutionState.Challenged);

        emit Challenged(containerHash, msg.sender, _reason, _config.challengeDeposit);
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

    function _setState(bytes32 _containerHash, ExecutionState _state) internal {
        executionTime[_containerHash] = encodeState(_state);
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
        require(decodeState(executionTime[_containerHash]) == _requiredState, "queue: bad state");
    }

    function decodeState(uint256 _execTime) internal pure returns (ExecutionState) {
        if (_execTime == 0) return ExecutionState.None;
        if (_execTime < CHALLENGED) return ExecutionState.Scheduled;
        if (_execTime == CHALLENGED) return ExecutionState.Challenged;
        if (_execTime == CANCELLED) return ExecutionState.Cancelled;
        else return ExecutionState.Executed;
    }

    function encodeState(ExecutionState _state) internal pure returns (uint256) {
        if (_state == ExecutionState.None) return 0;
        if (_state == ExecutionState.Challenged) return CHALLENGED;
        if (_state == ExecutionState.Cancelled) return CANCELLED;
        if (_state == ExecutionState.Executed) return EXECUTED;
        assert(false); // code should never try to encode a Scheduled state using this
    }
}
