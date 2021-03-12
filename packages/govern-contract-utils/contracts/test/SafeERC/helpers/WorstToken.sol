/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;

contract WorstToken {
    mapping(address => uint256) public balances;
    mapping(address => uint256) public approvals;

    function transfer(address to, uint256 value) public returns (bool) {
        if (value > balances[msg.sender]) {
            return false;
        }
        balances[msg.sender] = balances[msg.sender] - value;
        balances[to] = balances[to] + value;
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public returns (bool) {
        if (value > balances[from]) {
            return false;
        }
        balances[from] = balances[from] - value;
        balances[to] = balances[to] + value;
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
