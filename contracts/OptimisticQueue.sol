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
    using SafeERC20 for ERC20;

    // Permanent state
    bytes32 public configHash;
    uint256 public nonce;
    mapping (bytes32 => OptimisticQueueStateLib.Item) public queue;

    // Temporary state
    mapping (bytes32 => address) public challengerCache;
    mapping (IArbitrator => mapping (uint256 => bytes32)) public disputeItemCache;

    constructor(address _aclRoot, ERC3000Data.Config memory _initialConfig) MiniACL(_aclRoot) public {
        _setConfig(_initialConfig);
    }

    function schedule(ERC3000Data.Container memory _container)
        auth(this.schedule.selector)
        override public
        returns (bytes32 containerHash)
    {   
        require(_container.payload.nonce == ++nonce, "queue: bad nonce"); // prevent griefing by front-running
        bytes32 _configHash = _container.config.hash();
        require(_configHash == configHash, "queue: bad config");
        require(_container.payload.executionTime >= block.timestamp + _container.config.executionDelay, "queue: bad delay");
        require(_container.payload.submitter == msg.sender, "queue: bad submitter");

        containerHash = ERC3000Data.containerHash(_container.payload.hash(), _configHash);
        queue[containerHash].transitionState(
            OptimisticQueueStateLib.State.None,
            OptimisticQueueStateLib.State.Scheduled
        );

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
        queue[containerHash].transitionState(
            OptimisticQueueStateLib.State.Scheduled,
            OptimisticQueueStateLib.State.Executed
        );

        _container.config.scheduleDeposit.releaseTo(_container.payload.submitter);
        
        return _execute(_container.payload, containerHash);
    }

    function challenge(ERC3000Data.Container memory _container, bytes memory _reason) auth(this.challenge.selector) override public returns (uint256 disputeId) {
        bytes32 containerHash = _container.hash();
        challengerCache[containerHash] = msg.sender;
        queue[containerHash].transitionState(
            OptimisticQueueStateLib.State.Scheduled,
            OptimisticQueueStateLib.State.Challenged
        );
        
        IArbitrator arbitrator = IArbitrator(_container.config.resolver);
        (address recipient, ERC20 feeToken, uint256 feeAmount) = arbitrator.getDisputeFees();
        require(feeToken.safeTransferFrom(msg.sender, address(this), feeAmount), "queue: bad fee pull");
        require(feeToken.safeApprove(recipient, feeAmount), "queue: bad approve");
        disputeId = arbitrator.createDispute(2, abi.encode(_container));
        require(feeToken.safeApprove(recipient, 0), "queue: bad reset"); // for security with non-compliant tokens (that fail on non-zero to non-zero approvals)

        emit EvidenceSubmitted(arbitrator, disputeId, _container.payload.submitter, _container.payload.proof, true);
        emit EvidenceSubmitted(arbitrator, disputeId, msg.sender, _reason, true);
        arbitrator.closeEvidencePeriod(disputeId);

        disputeItemCache[arbitrator][disputeId] = containerHash;

        ERC3000Data.Collateral memory collateral = _container.config.challengeDeposit;
        collateral.collectFrom(msg.sender);

        emit Challenged(containerHash, msg.sender, _reason, disputeId, collateral);
    }

    function resolve(ERC3000Data.Container memory _container, uint256 _resolverId) override public returns (bytes[] memory execResults) {
        bytes32 containerHash = _container.hash();
        if (queue[containerHash].state == OptimisticQueueStateLib.State.Challenged) {
            // will re-enter in `rule`, `rule` will perform state transition depending on ruling
            IArbitrator(_container.config.resolver).executeRuling(_resolverId);
        }

        bool approved = queue[containerHash].state == OptimisticQueueStateLib.State.Approved;
        if (approved) {
            execResults = executeApproved(_container);
        } else {
            settleRejection(_container);
        }

        emit Resolved(containerHash, msg.sender, approved);
    }

    function veto(bytes32 _payloadHash, ERC3000Data.Config memory _config, bytes memory _reason) auth(this.veto.selector) override public {
        bytes32 containerHash = ERC3000Data.containerHash(_payloadHash, _config.hash());
        queue[containerHash].transitionState(
            OptimisticQueueStateLib.State.Scheduled,
            OptimisticQueueStateLib.State.Cancelled
        );

        emit Vetoed(containerHash, msg.sender, _reason, _config.vetoDeposit);
    }

    function configure(ERC3000Data.Config memory _config)
        auth(this.configure.selector)
        override public
        returns (bytes32)
    {
        return _setConfig(_config);
    }

    // Finalization functions
    // In the happy path, they are never externally called, but left public for security

    function executeApproved(ERC3000Data.Container memory _container) public returns (bytes[] memory execResults) {
        bytes32 containerHash = _container.hash();
        queue[containerHash].transitionState(
            OptimisticQueueStateLib.State.Approved,
            OptimisticQueueStateLib.State.Executed
        );

        _container.config.scheduleDeposit.releaseTo(_container.payload.submitter);
        _container.config.challengeDeposit.releaseTo(_container.payload.submitter);

        return _execute(_container.payload, containerHash);
    }

    function settleRejection(ERC3000Data.Container memory _container) public {
        bytes32 containerHash = _container.hash();
        queue[containerHash].transitionState(
            OptimisticQueueStateLib.State.Rejected,
            OptimisticQueueStateLib.State.Cancelled
        );

        address challenger = challengerCache[containerHash];
        _container.config.scheduleDeposit.releaseTo(challenger);
        _container.config.challengeDeposit.releaseTo(challenger);
        challengerCache[containerHash] = address(0); // refund gas, no longer needed in state        
    }

    // Arbitrable

    function rule(uint256 _disputeId, uint256 _ruling) override external {
        IArbitrator arbitrator = IArbitrator(msg.sender);
        bytes32 containerHash = disputeItemCache[arbitrator][_disputeId];
        queue[containerHash].transitionState(
            OptimisticQueueStateLib.State.Challenged,
            _ruling == ALLOW_RULING ? OptimisticQueueStateLib.State.Approved : OptimisticQueueStateLib.State.Rejected
        );
        disputeItemCache[IArbitrator(msg.sender)][_disputeId] = bytes32(0); // refund gas, no longer needed in state

        emit Ruled(arbitrator, _disputeId, _ruling);
    }

    function submitEvidence(uint256, bytes calldata, bool) override external {
        revert("queue: evidence");
    }

    // ERC-165

    function supportsInterface(bytes4 _interfaceId) override public pure returns (bool) {
        return _interfaceId == ARBITRABLE_INTERFACE_ID || super.supportsInterface(_interfaceId);
    }

    // Internal

    function _execute(ERC3000Data.Payload memory _payload, bytes32 _containerHash) internal returns (bytes[] memory execResults) {
        execResults = _payload.executor.exec(_payload.actions);
        emit Executed(_containerHash, msg.sender, execResults);
    }

    function _setConfig(ERC3000Data.Config memory _config) internal returns (bytes32) {
        configHash = _config.hash();

        emit Configured(configHash, msg.sender, _config);

        return configHash;
    }
}
