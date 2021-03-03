
/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity ^0.6.8;

import "./ArbitratorMock.sol";
import "@aragon/govern-contract-utils/contracts/erc20/SafeERC20.sol";

contract ArbitratorWrongSubjectMock is ArbitratorMock {


    constructor(ERC20 _token) ArbitratorMock(_token) public {

    }

    /**
    * @dev Tell the winning outcome of the final ruling.
    * @return subject address who made the dispute
    * @return rulingExecuted final outcome
    */
    function rule(uint256 /*_disputeId*/) override view external returns(address, uint256){
        return (address(0), 4);
    }

}