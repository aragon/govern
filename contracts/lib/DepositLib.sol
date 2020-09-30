/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;

import "erc3k/contracts/ERC3000Data.sol";

import "./SafeERC20.sol";

library DepositLib {
    using SafeERC20 for ERC20;

    address internal constant ETH = address(0);

    event Collected(address indexed token, address indexed from, uint256 amount);
    event Released(address indexed token, address indexed to, uint256 amount);

    function collectFrom(ERC3000Data.Collateral memory _collateral, address _from) internal {
        if (_collateral.token == ETH) {
            require(msg.value == _collateral.amount, "queue: bad get eth");
        } else {
            ERC20 token = ERC20(_collateral.token);
            require(token.safeTransferFrom(_from, msg.sender, _collateral.amount), "queue: bad get token");
        }

        emit Collected(_collateral.token, _from, _collateral.amount);
    }

    function releaseTo(ERC3000Data.Collateral memory _collateral, address _to) internal {
        if (_collateral.token == ETH) {
            address payable to = address(uint160(_to));
            (bool ok,) = to.call{ value: _collateral.amount }("");
            require(ok, "queue: bad send eth");
        } else {
            ERC20 token = ERC20(_collateral.token);
            require(token.safeTransfer(_to, _collateral.amount), "queue: bad send token");
        }

        emit Released(_collateral.token, _to, _collateral.amount);
    }
}