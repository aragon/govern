/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;

import "../../../safe-math/SafeMath.sol";

contract BadToken {
	mapping (address => uint) public balances;
    mapping (address => uint) public approvals;

	// Breaks ERC20 spec: those 2 should return (bool)
	function transfer(address to, uint value) public {
		balances[msg.sender] = SafeMath.sub(balances[msg.sender], value);
		balances[to] = SafeMath.add(balances[to], value);
	}

	function transferFrom(address from, address to, uint value) public {
		balances[from] = SafeMath.sub(balances[from], value);
		balances[to] = SafeMath.add(balances[to], value);
	}

    function approve(address spender, uint value) public  {
		approvals[spender] = value;
	}

	function setBalanceTo(address to, uint value) public {
		balances[to] = value;
	}
}

