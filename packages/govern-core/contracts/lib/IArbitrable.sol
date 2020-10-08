/*
 * SPDX-License-Identifier:    MIT
 */

// From https://github.com/aragon/aragon-court/blob/master/contracts/arbitration/IArbitrable.sol

pragma solidity ^0.6.8;

import "./IArbitrator.sol";

abstract contract IArbitrable {
    bytes4 internal constant ARBITRABLE_INTERFACE_ID = bytes4(0x88f3ee69);
    uint256 internal constant ALLOW_RULING = 4;

    /**
    * @dev Emitted when an IArbitrable instance's dispute is ruled by an IArbitrator
    * @param arbitrator IArbitrator instance ruling the dispute
    * @param disputeId Identification number of the dispute being ruled by the arbitrator
    * @param ruling Ruling given by the arbitrator
    */
    event Ruled(IArbitrator indexed arbitrator, uint256 indexed disputeId, uint256 ruling);

    /**
    * @dev Emitted when new evidence is submitted for the IArbitrable instance's dispute
    * @param arbitrator IArbitrator submitting the evidence for
    * @param disputeId Identification number of the dispute receiving new evidence
    * @param submitter Address of the account submitting the evidence
    * @param evidence Data submitted for the evidence of the dispute
    * @param finished Whether or not the submitter has finished submitting evidence
    */
    event EvidenceSubmitted(IArbitrator indexed arbitrator, uint256 indexed disputeId, address indexed submitter, bytes evidence, bool finished);

    /**
    * @dev Submit evidence for a dispute
    * @param _disputeId Id of the dispute in the Court
    * @param _evidence Data submitted for the evidence related to the dispute
    * @param _finished Whether or not the submitter has finished submitting evidence
    */
    function submitEvidence(uint256 _disputeId, bytes calldata _evidence, bool _finished) virtual external;

    /**
    * @dev Give a ruling for a certain dispute, the account calling it must have rights to rule on the contract
    * @param _disputeId Identification number of the dispute to be ruled
    * @param _ruling Ruling given by the arbitrator, where 0 is reserved for "refused to make a decision"
    */
    function rule(uint256 _disputeId, uint256 _ruling) virtual external;
}