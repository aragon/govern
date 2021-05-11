/* eslint-disable */
import { getToken } from '@aragon/govern';
import { ValidateResult } from 'react-hook-form';
import Abi from './AbiHandler';

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
  try {
    const tokenInfo = await getToken(address, provider);
    return true;
  } catch (error) {}
  return 'Token adress is not valid.';
};

/**
 * Check if contract is a contract
 *
 * @param address <string> address to be validated
 * @param provider <rpc-provider>
 * @returns <ValidateResult> true if valid, or error message if invalid
 */
export const validateContract = async (
  address: string,
  provider: any,
): Promise<ValidateResult> => {
  try {
    const validAddress = await provider.getCode(address);
    return true;
  } catch (error) {}
  return 'Contract address is not valid.';
};

/**
 * Check if a contract ABI is in good format
 *
 * @param abi <string> abi to be validated
 * @returns <ValidateResult> true if valid, or error message if invalid
 */
export const validateAbi = (abi: string): ValidateResult => {
  return Abi.isValidAbi(abi) ? true : 'Contract ABI is not valid.';
};
