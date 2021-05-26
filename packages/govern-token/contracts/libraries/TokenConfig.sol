/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;

import "../interfaces/IERC20.sol";

library TokenConfig {

    struct Token {
        IERC20 tokenAddress;
        uint8  tokenDecimals;
        string tokenName;
        string tokenSymbol;
        address mintAddress;
        uint256 mintAmount;
    }

    
}