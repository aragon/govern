/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;


import "../../erc20/SafeERC20.sol";
import "./helpers/GoodToken.sol";
import "./helpers/BadToken.sol";
import "./helpers/WorstToken.sol";
import "../../erc20/ERC20.sol";

contract SafeERC20Mock {

	event Transfer(bool transfer);
	event Approve(bool approve);

	function safeTransfer(address token, uint _amount) public {
		require(SafeERC20.safeTransfer(ERC20(token), address(0x0), _amount), "SAFE_TRANSFER: Fail");
		emit Transfer(true);
	}

	function safeTransferFrom(address token, uint _amount) public {
		require(SafeERC20.safeTransferFrom(ERC20(token), address(this), address(0x0), _amount), "SAFE_TRANSFER_FROM: Fail");
		emit Transfer(true);
	}

	function safeApprove(address token, uint _amount) public {
		require(SafeERC20.safeApprove(ERC20(token), address(this), _amount), "SAFE_APPROVE: Fail");
		emit Approve(true);
	}
    
}

