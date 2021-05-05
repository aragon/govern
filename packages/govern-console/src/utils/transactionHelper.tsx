/* eslint-disable*/
import {
  CustomTransaction,
  Response,
  CustomTransactionStatus,
} from 'utils/types';
import { ethers, BigNumber } from 'ethers';
import { erc20TokenABI } from './abis/erc20';
import { AddressZero } from '@ethersproject/constants'
import { CourtABI } from 'utils/abis/court';
import { BigNumberish } from '@ethersproject/bignumber'

/**
 * @param token address of the token
 * @param amount how much to approve
 * @param spender spender
 * @param account owner
 * @param ethersProvider
 *
 * @returns {Promise<Response>}
 */
export async function erc20ApprovalTransaction(
  token: string,
  amount: BigNumberish,
  spender: string,
  account: string,
  signer: any,
): Promise<CustomTransaction[]> {

  // if the token is zero address, it means there's no need for approval
  if (token === AddressZero) {
    return []
  }

  const amountInBigNumber: BigNumber = ethers.BigNumber.from(amount);

  const contract = new ethers.Contract(
    token,
    erc20TokenABI,
    signer,
  );

  let allowance: BigNumber = ethers.BigNumber.from(0);
  let userBalance: BigNumber = ethers.BigNumber.from(0);

  try {
    allowance = await contract.allowance(account, spender);
    userBalance = await contract.balanceOf(account);
  } catch (err) {
    // contract address might not have `allowance` or balanceOf on it.
    // TODO: track it with sentry
    throw new Error(`Contract ${token} doesn't seem to be ERC20 compliant.`)
  }

  // user balance is less than the amount that needs approval.
  // this means user won't be able to approve full amount.
  if (userBalance.lt(amountInBigNumber)) {
    throw new Error(`You need ${amount} to schedule this proposal.`)
  }

  // user has enough balance, but also already got amountInBigNumber approved for spender
  if (allowance.gte(amountInBigNumber)) {
    return [];
  }

  // approve amountInBigNumber for the spender
  const transaction: CustomTransaction = {
    tx: () => {
      return contract.approve(spender, amountInBigNumber);
    },
    message: `Approves ${amountInBigNumber} Tokens. `,
    status: CustomTransactionStatus.Pending,
  };

  // we currently only return 1 transaction, though it might be needed that this function takes care
  // of zero approval first and then the amount approval.
  return [transaction]
}
