/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;

import "@aragon/govern-contract-utils/contracts/erc20/SafeERC20.sol";

contract ArbitratorMock {
    using SafeERC20 for ERC20;

    ERC20 public token;

    uint256 public possibleRulings;
    bytes   public metadata;
    uint256 public evidencePeriodClosed;
    uint256 public rulingExecuted;
    address public subject;
    uint256 public winningOutcome;


    constructor(ERC20 _token) public {
        token = _token;
    }

    /**
    * @dev Create a dispute over the Arbitrable sender with a number of possible rulings
    * @param _possibleRulings Number of possible rulings allowed for the dispute
    * @param _metadata Optional metadata that can be used to provide additional information on the dispute to be created
    * @return Dispute identification number
    */
    function createDispute(uint256 _possibleRulings, bytes calldata _metadata) external returns (uint256) {
        possibleRulings = _possibleRulings;
        metadata = _metadata;
        subject = msg.sender;
       
        return 1000;
    }

    /**
    * @dev Close the evidence period of a dispute
    * @param _disputeId Identification number of the dispute to close its evidence submitting period
    */
    function submitEvidence(uint256 _disputeId, address /*subtmitter*/, bytes calldata /*proof*/) external {
        evidencePeriodClosed = _disputeId;
    }

    /**
    * @dev Close the evidence period of a dispute
    * @param _disputeId Identification number of the dispute to close its evidence submitting period
    */
    function closeEvidencePeriod(uint256 _disputeId) external {
        evidencePeriodClosed = _disputeId;
    }


    /**
    * @dev Update the final Ruling of the dispute
    * @param _rule Identification number of the dispute to be executed
    */
    function executeRuling(uint256 /*_disputeId*/, uint256 _rule) external {
        rulingExecuted = _rule;
    }

    /**
    * @dev Tell the dispute fees information to create a dispute
    * @return recipient Address where the corresponding dispute fees must be transferred to
    * @return feeToken ERC20 token used for the fees
    * @return feeAmount Total amount of fees that must be allowed to the recipient
    */
    function getDisputeFees() external view returns (address recipient, ERC20 feeToken, uint256 feeAmount) {
        return (address(this), token, 1000);
    }


    /**
    * @dev Tell the subscription fees information for a subscriber to be up-to-date
    * @return recipient Address where the corresponding subscriptions fees must be transferred to
    * @return feeToken ERC20 token used for the subscription fees
    * @return feeAmount Total amount of fees that must be allowed to the recipient
    */
    function getSubscriptionFees(address /*_subscriber*/) external view returns (address recipient, ERC20 feeToken, uint256 feeAmount) {
        return (address(this), token, 1000);
    }
    
    /**
    * @dev Tell the winning outcome of the final ruling.
    * @return subject address who made the dispute
    * @return rulingExecuted final outcome
    */
    function rule(uint256 /*_disputeId*/) external view virtual returns(address, uint256){
        return (subject, rulingExecuted);
    }

}
