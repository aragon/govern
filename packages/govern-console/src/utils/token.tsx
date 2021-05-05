/* eslint-disable */

import { Token, getToken, DaoConfig } from '@aragon/govern';
import { ethers, BigNumber, BigNumberish } from 'ethers';

/**
 * @param address address of the token
 * @param amount  amount
 * @param isFormat if true - appends, else cuts off tokenDecimals 0's
 * @param ethersProvider provider
 * 
 * @returns {BigNumberish} amount
 */
export const correctDecimal = async (
    address: string,
    amount: string | BigNumberish,
    isFormat: boolean,
    ethersProvider: any
) => {
    try {
        const token: Token = await getToken(address, ethersProvider);
        return isFormat ? 
            ethers.utils.parseUnits(amount.toString(), token.tokenDecimals) :
            ethers.utils.formatUnits(amount, token.tokenDecimals);

    } catch (err) {
        return amount;
    }
};