/*
 * SPDX-License-Identifier:    MIT
 */

pragma solidity 0.6.8;

import "@openzeppelin/contracts/access/Ownable.sol";

import "@aragon/govern-contract-utils/contracts/erc20/SafeERC20.sol";
import "@aragon/govern-contract-utils/contracts/erc20/ERC20.sol";
import "@aragon/govern-contract-utils/contracts/address-utils/AddressUtils.sol";

contract Finance is Ownable {
    using AddressUtils for address;
    using SafeERC20 for ERC20;
    
    string private constant ERROR_ETH_DEPOSIT_TOKEN_MISMATCH  = "PB_ETH_DEPOSIT_TOKEN_MISMATCH";
    string private constant ERROR_ETH_DEPOSIT_AMOUNT_MISMATCH = "PB_ETH_DEPOSIT_AMOUNT_MISMATCH";
    string private constant ERROR_TOKEN_NOT_CONTRACT = "PB_TOKEN_NOT_CONTRACT";
    string private constant ERROR_TOKEN_DEPOSIT_FAILED = "PB_TOKEN_DEPOSIT_FAILED";
    string private constant ERROR_ETH_TRANSFER_FAILED = "PB_ETH_TRANSFER_FAILED";
    string private constant ERROR_TOKEN_TRANSFER_FAILED = "PB_TOKEN_TRANSFER_FAILED";
    
    /**
    * @dev Initialize Finance contract and transfer ownership to executor
    * @param _executor Address of the executor
    */
    constructor(address _executor) public {
        transferOwnership(_executor);
    }

     /**
    * @notice deposit ETH or ERC20
    * @dev Allows to deposit ETH(if _token is zero address) or ERC20(if _token) is a contract. 
    * @param _token Address of the token to deposit
    * @param _from Owner of the deposited funds
    * @param _amount Amount to be deposited
    */
    function deposit(address _token, address _from, uint256 _amount) external payable onlyOwner {
        if (msg.value > 0) {
            require(_token == address(0), ERROR_ETH_DEPOSIT_TOKEN_MISMATCH);
            require(msg.value == _amount, ERROR_ETH_DEPOSIT_AMOUNT_MISMATCH);
        } else {
            // This assumes _token is a contract address, otherwise it fails
            require(ERC20(_token).safeTransferFrom(_from, address(this), _amount), ERROR_TOKEN_DEPOSIT_FAILED);
        }

    }
    
    /**
    * @dev Internal function to transfer tokens
    * @param _token Address of the token to transfer
    * @param _to Recipient of the transfer
    * @param _amount Amount to be transferred
    */
    function transfer(address _token, address payable _to, uint256 _amount) external onlyOwner {
        if (_token == address(0)) {
            require(_to.send(_amount), ERROR_ETH_TRANSFER_FAILED);
        } else {
            require(ERC20(_token).safeTransfer(_to, _amount), ERROR_TOKEN_TRANSFER_FAILED);
        }
    }
}

