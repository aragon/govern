/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;

import "erc3k/contracts/ERC3000Data.sol";

import "../erc20/ERC20.sol";
import "../erc20/SafeERC20.sol";

library DepositLib {
    using SafeERC20 for ERC20;

    event Locked(address indexed token, address indexed from, uint256 amount);
    event Unlocked(address indexed token, address indexed to, uint256 amount);

    function collectFrom(ERC3000Data.Collateral memory _collateral, address _from) internal {
        if (_collateral.amount > 0) {
            ERC20 token = ERC20(_collateral.token);
            require(token.safeTransferFrom(_from, address(this), _collateral.amount), "deposit: bad token lock");

            emit Locked(_collateral.token, _from, _collateral.amount);
        }
    }

    function releaseTo(ERC3000Data.Collateral memory _collateral, address _to) internal {
        if (_collateral.amount > 0) {
            ERC20 token = ERC20(_collateral.token);
            require(token.safeTransfer(_to, _collateral.amount), "deposit: bad token release");

            emit Unlocked(_collateral.token, _to, _collateral.amount);
        }
    }
}
