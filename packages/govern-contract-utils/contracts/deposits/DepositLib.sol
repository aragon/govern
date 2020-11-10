/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;

import "erc3k/contracts/ERC3000Data.sol";

import "../erc20/SafeERC20.sol";

library DepositLib {
    using SafeERC20 for ERC20;

    event Lock(address indexed token, address indexed from, uint256 amount);
    event Unlock(address indexed token, address indexed to, uint256 amount);

    function collectFrom(ERC3000Data.Collateral memory _collateral, address _from) internal {
        if (_collateral.amount > 0) {
            ERC20 token = ERC20(_collateral.token);
            require(token.safeTransferFrom(_from, address(this), _collateral.amount), "queue: bad get token");

            emit Lock(_collateral.token, _from, _collateral.amount);
        }
    }

    function releaseTo(ERC3000Data.Collateral memory _collateral, address _to) internal {
        if (_collateral.amount > 0) {
            ERC20 token = ERC20(_collateral.token);
            require(token.safeTransfer(_to, _collateral.amount), "queue: bad send token");

            emit Unlock(_collateral.token, _to, _collateral.amount);
        }
    }
}