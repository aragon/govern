/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;

import '../../../safe-math/SafeMath.sol';

contract GoodToken {
	
    mapping(address => uint256) public balances;
    mapping(address => uint256) public approvals;

    event Transfer(address indexed from, address indexed to, uint256 value);

    function transfer(address to, uint256 value) public returns (bool) {
        require(balances[msg.sender] >= value, 'INSUFFICIENT_FUNDS');
        balances[msg.sender] = SafeMath.sub(balances[msg.sender], value);
        balances[to] = SafeMath.add(balances[to], value);
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public returns (bool) {
        require(balances[from] >= value, 'INSUFFICIENT_FUNDS');
        balances[from] = SafeMath.sub(balances[from], value);
        balances[to] = SafeMath.add(balances[to], value);
        if (approvals[msg.sender] > 0) approvals[msg.sender] = 0;
        emit Transfer(from, to, value);
        return true;
    }

    function approve(address spender, uint256 value) public returns (bool) {
        approvals[spender] = value;
        return true;
    }

    function setBalanceTo(address to, uint256 value) public {
        balances[to] = value;
    }
}
