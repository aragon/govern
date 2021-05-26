/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity ^0.6.8;

import "../interfaces/IERC20.sol";

library TokenLib {
    
    struct TokenConfig {
        IERC20 tokenAddress;
        uint8  tokenDecimals;
        string tokenName;
        string tokenSymbol;
        address mintAddress; // initial minter address
        uint256 mintAmount; // how much to mint to initial minter address
        bytes32 merkleRoot; // merkle distribution root.
        uint256 merkleMintAmount; // how much to mint for the distributor.
    }
    
}