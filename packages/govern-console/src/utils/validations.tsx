import { ValidateResult } from 'react-hook-form';
import Abi from './AbiHandler';
import { isTokenERC20 } from 'utils/token';
import { utils, Contract, BigNumber, providers } from 'ethers';
import { erc20TokenABI } from 'abis/erc20';
import { Asset } from 'utils/Asset';

/**
 * Validate file size
 *
 * @param files <FileList>
 * @param size <number> file size allowed in MB.
 * @returns <ValidateResult> true if valid, or error message if invalid
 */
export const validateFileSize = async (files: FileList, size: number): Promise<ValidateResult> => {
  if (files[0].size / 1024 / 1024 <= size) return true;
  return `File size exceeds ${size}MB.`;
};

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
 * Validates amount dependin on decimal.
 * @dev if the decimals is 0, and amount contains fractions or
 * if the decimals is more than 0 and it doesn't contain fractions, it returns an error
 *
 * @param amount amount
 * @param decimals decimals
 */
export const validateAmountForDecimals = (amount: string, decimals: number) => {
  if (parseInt(amount) < 0) {
    return 'The amount must be positive';
  }

  if (!decimals) {
    if (amount.includes('.')) {
      return "The token doesn't contain decimals. Please enter the exact amount";
    }
    return true;
  }
  if (!amount.includes('.')) {
    return 'Include decimals, e.g. 10.0';
  }

  if (amount.split('.')[1].length > decimals) {
    return `The fractional component exceeds the decimals - ${decimals}`;
  }

  return true;
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

/**
 * validates if the number is positive.
 * @param num number
 * @returns <ValidateResult>
 */
export const positiveNumber = (num: number | string): ValidateResult => {
  if (typeof num === 'string') {
    num = parseInt(num);
  }
  return num > 0 ? true : 'Value must be positive';
};

/**
 * check if the address is valid
 * @param address address to be validated
 * @returns <ValidateResult> true if valid, error message if invalid
 */
export const validateAddress = (address: string): ValidateResult => {
  return utils.isAddress(address) ? true : 'Invalid address';
};

/**
 * validate that the asset balance of the owner is greater or equal to the amount
 * @param asset asset to be verified
 * @param ownerAddress owner address to be validated
 * @param provider interface to node
 * @returns  <ValidateResult> true if valid, error message if invalid
 */
export const validateBalance = async (
  asset: Asset,
  ownerAddress: string,
  provider: providers.Web3Provider,
): Promise<ValidateResult> => {
  let balance = BigNumber.from(0);

  if (asset.isEth()) {
    balance = await provider.getBalance(ownerAddress);
  } else {
    const contract = new Contract(asset.address, erc20TokenABI, provider);
    balance = await contract.balanceOf(ownerAddress);
  }

  return BigNumber.from(asset.amount).lte(balance) ? true : 'Insufficient balance';
};
