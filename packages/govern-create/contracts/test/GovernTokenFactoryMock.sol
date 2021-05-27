/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "@aragon/govern-token/contracts/GovernMinter.sol";
import "@aragon/govern-token/contracts/GovernToken.sol";

import "@aragon/govern-token/contracts/libraries/TokenLib.sol";

contract GovernTokenFactoryMock {
   
    event NewTokenCalledWith(address initialMinter, string _tokenName, string _tokenSymbol, uint8 tokenDecimals, address mintAddr, uint256 mintAmount, bool useProxies);
  
    function newToken(
        address _initialMinter,
        TokenLib.TokenConfig calldata _token,
        bool _useProxies
    ) external returns (
        GovernToken token,
        GovernMinter minter
    ) {
        emit NewTokenCalledWith(
            _initialMinter, 
            _token.tokenName, 
            _token.tokenSymbol, 
            _token.tokenDecimals, 
            _token.mintAddress, 
            _token.mintAmount, 
            _useProxies
        );

        token = GovernToken(address(this));
        minter = GovernMinter(address(this));
    }

   
}
