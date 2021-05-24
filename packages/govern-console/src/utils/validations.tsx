import { ValidateResult } from 'react-hook-form';
import Abi from './AbiHandler';
import { isTokenERC20 } from 'utils/token';

/**
 * Validate if address is an ERC20 token
 *
 * @param address <string> address to be validated
 * @param provider <rpc-provider>
 * @returns <ValidateResult> true if valid, or error message if invalid
 */
export const validateToken = async (address: string, provider: any): Promise<ValidateResult> => {
  const isERC20 = await isTokenERC20(address, provider);
  return isERC20 || 'Token adress is not ERC20 compliant';
};

/**
 * Check if contract is a contract
 *
 * @param address <string> address to be validated
 * @param provider <rpc-provider>
 * @returns <ValidateResult> true if valid, or error message if invalid
 */
export const validateContract = async (address: string, provider: any): Promise<ValidateResult> => {
  try {
    const code = await provider.getCode(address);
    if (code !== '0x') return true;
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
