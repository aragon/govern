/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;
pragma experimental ABIEncoderV2;

import "../deposits/DepositLib.sol";
import "erc3k/contracts/ERC3000Data.sol";

contract DepositLibMock {
    event Transfer(bool transfer);
	event Approve(bool approve);

    using DepositLib for ERC3000Data.Collateral;

	function collectFrom(ERC3000Data.Collateral memory _collateral, address _from) public {
        _collateral.collectFrom(_from);
	}

	function releaseTo(ERC3000Data.Collateral memory _collateral, address _to) public {
		_collateral.releaseTo(_to);
	}
}
