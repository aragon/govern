/* eslint-disable */
import { getToken } from '@aragon/govern';
import { ValidateResult } from 'react-hook-form';
import { utils } from 'ethers'


export const isAddress = (
  address: string
): ValidateResult => {
  return utils.isAddress(address) ? true : 'Address is not valid';
}


export const validateToken = async (
  address: string,
  provider: any,
): Promise<ValidateResult> => {
  console.log("coming hhh")
  try {
    const tokenInfo = await getToken(address, provider);
    if (tokenInfo) return true;
  } catch (error) {

  }
  return 'Token adress is not valid.';
};
