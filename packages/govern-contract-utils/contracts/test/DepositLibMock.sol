/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../deposits/DepositLib.sol";
import "erc3k/contracts/ERC3000Data.sol";

contract DepositLibMock {
    using DepositLib for ERC3000Data.Collateral;
    
    // Below two events are duplicated from the DepositLib library to make sure that this contract
    // contains the Locked/Unlocked event in its own abi in order to test if the events were thrown or not.
    // For more info: https://github.com/ethereum/solidity/pull/10996
    event Locked(address indexed token, address indexed from, uint256 amount);
    event Unlocked(address indexed token, address indexed to, uint256 amount);
    
    function collectFrom(ERC3000Data.Collateral memory _collateral, address _from) public {
        _collateral.collectFrom(_from);
	}

	function releaseTo(ERC3000Data.Collateral memory _collateral, address _to) public {
		_collateral.releaseTo(_to);
	}
}
