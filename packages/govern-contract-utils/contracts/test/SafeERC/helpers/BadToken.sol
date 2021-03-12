/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;

import '../../../safe-math/SafeMath.sol';

contract BadToken {
    mapping(address => uint256) public balances;
    mapping(address => uint256) public approvals;

    // Breaks ERC20 spec: those 2 should return (bool)
    function transfer(address to, uint256 value) public {
        balances[msg.sender] = SafeMath.sub(balances[msg.sender], value);
        balances[to] = SafeMath.add(balances[to], value);
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public {
        balances[from] = SafeMath.sub(balances[from], value);
        balances[to] = SafeMath.add(balances[to], value);
    }

    function approve(address spender, uint256 value) public {
        approvals[spender] = value;
    }

    function setBalanceTo(address to, uint256 value) public {
        balances[to] = value;
    }
}
