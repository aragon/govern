/* eslint-disable */
import { getToken } from '@aragon/govern';
import { ValidateResult } from 'react-hook-form';

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
