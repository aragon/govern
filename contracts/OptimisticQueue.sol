/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "erc3k/contracts/ERC3000.sol";

import "./lib/IArbitrable.sol";
import "./lib/DepositLib.sol";
import "./lib/MiniACL.sol";
import "./lib/OptimisticQueueStateLib.sol";
import "./lib/SafeERC20.sol";

contract OptimisticQueue is ERC3000, IArbitrable, MiniACL {
    using ERC3000Data for *;
    using DepositLib for ERC3000Data.Collateral;
    using OptimisticQueueStateLib for OptimisticQueueStateLib.Item;

    mapping (bytes32 => OptimisticQueueStateLib.Item) public queue;
    mapping (IArbitrator => mapping (uint256 => bytes32)) public disputeItem;
    uint256 public nonce;
    bytes32 public configHash;

    constructor(address _aclRoot, ERC3000Data.Config memory _initialConfig) MiniACL(_aclRoot) public {
        _setConfig(_initialConfig);
    }

    function schedule(ERC3000Data.Container memory _container)
        auth(this.schedule.selector)
        override public
        returns (bytes32 containerHash)
    {   
        require(_container.payload.nonce == nonce++, "queue: bad nonce");
        
        bytes32 _configHash = _container.config.hash();
        require(_configHash == configHash, "queue: bad config");
        require(_container.payload.executionTime >= block.timestamp + _container.config.executionDelay, "queue: bad delay");
        require(_container.payload.submitter == msg.sender, "queue: bad submitter");

        containerHash = ERC3000Data.containerHash(_container.payload.hash(), _configHash);
        queue[containerHash].transitionState(OptimisticQueueStateLib.State.None, OptimisticQueueStateLib.State.Scheduled);

        ERC3000Data.Collateral memory collateral = _container.config.scheduleDeposit;
        collateral.collectFrom(msg.sender);
        // TODO: pay court tx fee

        emit Scheduled(containerHash, _container.payload, collateral);
    }
    
    function execute(ERC3000Data.Container memory _container)
        auth(this.execute.selector)
        override public
        returns (bytes[] memory execResults)
    {   
        require(uint64(block.timestamp) >= _container.payload.executionTime, "queue: wait more");
        
        bytes32 containerHash = _container.hash();
        queue[containerHash].transitionState(OptimisticQueueStateLib.State.Scheduled, OptimisticQueueStateLib.State.Executed);

        execResults = _container.payload.executor.exec(_container.payload.actions);
        _container.config.scheduleDeposit.releaseTo(_container.payload.submitter);
        
        emit Executed(containerHash, msg.sender, execResults);
    }
    

    function challenge(bytes32 _payloadHash, ERC3000Data.Config memory _config, bytes memory _reason) auth(this.challenge.selector) override public {
        bytes32 containerHash = ERC3000Data.containerHash(_payloadHash, _config.hash());

        queue[containerHash].transitionState(OptimisticQueueStateLib.State.Scheduled, OptimisticQueueStateLib.State.Challenged);
        queue[containerHash].challenger = msg.sender;
        
        uint256 disputeId;
        IArbitrator arbitrator;

        // TODO: create dispute

        disputeItem[arbitrator][disputeId] = containerHash;

        ERC3000Data.Collateral memory collateral = _config.challengeDeposit;
        collateral.collectFrom(msg.sender);

        emit Challenged(containerHash, msg.sender, _reason, collateral);
    }

    function veto(bytes32 _payloadHash, ERC3000Data.Config memory _config, bytes memory _reason) auth(this.veto.selector) override public {
        bytes32 containerHash = ERC3000Data.containerHash(_payloadHash, _config.hash());
        queue[containerHash].transitionState(OptimisticQueueStateLib.State.Scheduled, OptimisticQueueStateLib.State.Cancelled);

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
    function rule(uint256 _disputeId, uint256) override external {
        bytes32 containerHash = disputeItem[IArbitrator(msg.sender)][_disputeId];
        queue[containerHash].requireState(OptimisticQueueStateLib.State.Challenged);

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

    function _setConfig(ERC3000Data.Config memory _config) internal returns (bytes32) {
        configHash = _config.hash();

        emit Configured(configHash, msg.sender, _config);

        return configHash;
    }
}
