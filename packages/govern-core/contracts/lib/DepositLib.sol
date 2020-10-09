/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;

import "erc3k/contracts/ERC3000Data.sol";

import "./SafeERC20.sol";

library DepositLib {
    using SafeERC20 for ERC20;

    // Note: why not lock/unlock? I think it's been widely adopted by the community
    event Collected(address indexed token, address indexed from, uint256 amount);
    event Released(address indexed token, address indexed to, uint256 amount);

    function collectFrom(ERC3000Data.Collateral memory _collateral, address _from) internal {
        // Note: should this allow ETH deposits too?
        if (_collateral.amount > 0) {
            ERC20 token = ERC20(_collateral.token);
            require(token.safeTransferFrom(_from, msg.sender, _collateral.amount), "queue: bad get token");

            emit Collected(_collateral.token, _from, _collateral.amount);
        }
    }

    function releaseTo(ERC3000Data.Collateral memory _collateral, address _to) internal {
        if (_collateral.amount > 0) {
            ERC20 token = ERC20(_collateral.token);
            require(token.safeTransfer(_to, _collateral.amount), "queue: bad send token");

            emit Released(_collateral.token, _to, _collateral.amount);
        }
    }
}