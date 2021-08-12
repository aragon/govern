import { ethers, BigNumberish } from 'ethers';
import { erc20TokenABI } from 'abis/erc20';
import { formatUnits, parseUnits } from 'utils/lib';

export async function isTokenERC20(address: string, provider: any) {
  const contract = new ethers.Contract(address, erc20TokenABI, provider);
  try {
    await Promise.all([contract.balanceOf(address), contract.totalSupply()]);
    return true;
  } catch (err) {
    return false;
  }
}

export async function getTokenInfo(address: string, provider: any) {
  const contract = new ethers.Contract(address, erc20TokenABI, provider);
  let decimals = null,
    name = null,
    symbol = null;

  try {
    decimals = await contract.decimals();
  } catch (err) {}

  try {
    name = await contract.name();
  } catch (err) {}

  try {
    symbol = await contract.symbol();
  } catch (err) {}

  return {
    decimals,
    name,
    symbol,
  };
}

/**
 * @param address address of the token
 * @param amount  amount
 * @param isFormat if true - appends, else cuts off decimal number 0's
 * @param provider provider
 *
 * @returns {BigNumberish} amount
 */
export const correctDecimal = async (
  address: string,
  amount: string | BigNumberish,
  isFormat: boolean,
  provider: any,
) => {
  try {
    const { decimals } = await getTokenInfo(address, provider);
    if (!decimals) return amount;

    return isFormat ? parseUnits(amount.toString(), decimals) : formatUnits(amount, decimals);
  } catch (err) {
    return amount;
  }
};
