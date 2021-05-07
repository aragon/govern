/* eslint-disable */
import { getToken } from '@aragon/govern';
import { ethers } from 'ethers';
import { ValidateResult } from 'react-hook-form';


/**
 * Validate if address is an ERC20 token
 * 
 * @param address <string> address to be validated
 * @param provider <rpc-provider> 
 * @returns <ValidateResult> true if valid, or error message if invalid
 */
export const validateToken = async (
  address: string,
  provider: any,
): Promise<ValidateResult> => {
  const errorMessage = 'Token adress is not valid.';
  try {
    const tokenInfo = await getToken(address, provider);
    if (tokenInfo) return true;
  } catch (error) {
    return errorMessage;
  }
  return errorMessage;
};

/**
 * Validate if address is correct
 * 
 * @param address <string> address to be validated
 * @returns <ValidateResult> true if valid, or error message if invalid
 */
export const validateAddress = (
  address: string,
): ValidateResult => {
  const errorMessage = 'Adress is not valid.';
  try {
    const validAddress = ethers.utils.getAddress(address);
    if (validAddress) return true;
  } catch (error) {
    return errorMessage;
  }
  return errorMessage;
};
