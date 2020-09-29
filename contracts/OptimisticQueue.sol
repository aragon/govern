/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "erc3k/contracts/ERC3000.sol";

import "./Eaglet.sol";
import "./lib/MiniACL.sol";

contract OptimisticQueue is ERC3000, MiniACL {
    uint256 public index;
    bytes32 public configHash;
    mapping (bytes32 => uint256) public executionTime;

    uint256 internal constant EXECUTED =   uint256(-1);
    uint256 internal constant CANCELLED =  uint256(-2);
    uint256 internal constant CHALLENGED = uint256(-3);

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
        returns (bytes32 execHash)
    {   
        require(_container.nonce == index++, "queue: bad nonce");
        
        bytes32 _configHash = keccak256(abi.encode(_container.config));
        require(_configHash == configHash, "queue: bad config");

        uint256 execTime = block.timestamp + _container.config.executionDelay;
        execHash = getContainerHash(_container, _configHash);
        requireState(execHash, ExecutionState.None);

        executionTime[execHash] = execTime;

        ERC3000Data.Collateral memory collateral = _container.config.scheduleDeposit;

        emit Scheduled(execHash, msg.sender, _container.executor, _container.actions, _proof, _container.nonce, execTime, collateral);
    }
    
    function execute(ERC3000Data.Container memory _container)
        auth(this.execute.selector)
        override public
        returns (bytes[] memory execResults)
    {   
        bytes32 containerHash = getContainerHash(_container);
        requireState(containerHash, ExecutionState.Scheduled);

        require(executionTime[containerHash] <= block.timestamp, "queue: wait more");
        executionTime[containerHash] = encodeState(ExecutionState.Executed);

        execResults = _container.executor.exec(_container.actions);
        
        emit Executed(containerHash, msg.sender, _container.executor, execResults, _container.nonce);
    }
    

    function challenge(bytes32 _execHash, ERC3000Data.Config memory _config, bytes memory _reason) auth(this.challenge.selector) override public {
        bytes32 containerHash = getContainerHash(_execHash, _config);
        requireState(containerHash, ExecutionState.Scheduled);

        executionTime[containerHash] = encodeState(ExecutionState.Challenged);

        emit Challenged(containerHash, msg.sender, _reason, _config.challengeDeposit);
    }

    function veto(bytes32 _execHash, ERC3000Data.Config memory _config, bytes memory _reason) auth(this.veto.selector) override public {
        bytes32 containerHash = getContainerHash(_execHash, _config);
        requireState(containerHash, ExecutionState.Scheduled);

        executionTime[containerHash] = encodeState(ExecutionState.Cancelled);

        emit Vetoed(containerHash, msg.sender, _reason, _config.vetoDeposit);
    }

    function configure(ERC3000Data.Config memory _config)
        auth(this.configure.selector)
        override public
        returns (bytes32)
    {
        return _setConfig(_config);
    }

    function _setConfig(ERC3000Data.Config memory _config) internal returns (bytes32) {
        configHash = keccak256(abi.encode(_config));

        emit Configured(configHash, msg.sender, _config);

        return configHash;
    }

    function getContainerHash(ERC3000Data.Container memory _container) internal view returns (bytes32) {
        return getContainerHash(_container, keccak256(abi.encode(_container.config)));
    }

    function getContainerHash(ERC3000Data.Container memory _container, bytes32 _configHash) internal view returns (bytes32) {
        return getContainerHash(
            getExecHash(_container.nonce, _container.executor, _container.actions),
            _configHash
        );
    }

    function getContainerHash(bytes32 _execHash, ERC3000Data.Config memory _config) internal view returns (bytes32) {
        return getContainerHash(_execHash, keccak256(abi.encode(_config)));
    }

    function getContainerHash(bytes32 _execHash, bytes32 _configHash) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(this, _execHash, _configHash));
    }

    function getExecHash(uint256 _nonce, IERC3000Executor _executor, ERC3000Data.Action[] memory _actions) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_nonce, _executor, keccak256(abi.encode(_actions))));
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
