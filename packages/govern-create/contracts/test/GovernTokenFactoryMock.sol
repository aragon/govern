/*
 * SPDX-License-Identifier:    GPL-3.0
 */

pragma solidity 0.6.8;
pragma experimental ABIEncoderV2;

import "@aragon/govern-token/contracts/GovernMinter.sol";
import "@aragon/govern-token/contracts/GovernToken.sol";

contract GovernTokenFactoryMock {
   
    event NewTokenCalledWith(address initialMinter, string _tokenName, string _tokenSymbol, uint8 tokenDecimals, address mintAddr, uint256 mintAmount, bool useProxies);
  
    function newToken(
        address _initialMinter,
        string calldata _tokenName,
        string calldata _tokenSymbol,
        uint8 _tokenDecimals,
        address _mintAddr,
        uint256 _mintAmount,
        bool _useProxies
    ) external returns (
        GovernToken token,
        GovernMinter minter
    ) {
        emit NewTokenCalledWith(_initialMinter, _tokenName, _tokenSymbol, _tokenDecimals, _mintAddr, _mintAmount, _useProxies);
        token = GovernToken(address(this));
        minter = GovernMinter(address(this));
    }

   
}
