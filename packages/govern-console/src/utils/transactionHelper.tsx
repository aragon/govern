import { CustomTransaction, CustomTransactionStatus } from 'utils/types';
import { ethers, BigNumber } from 'ethers';
import { erc20TokenABI } from './abis/erc20';
import { AddressZero } from '@ethersproject/constants';
import { BigNumberish } from '@ethersproject/bignumber';
import { Account } from 'utils/types';

/**
 * @param token address of the token
 * @param amount how much to approve
 * @param spender spender
 * @param account address and the signer
 *
 * @returns {Promise<Response>}
 */
export async function erc20ApprovalTransaction(
  token: string,
  amount: BigNumberish,
  spender: string,
  account: Account,
): Promise<CustomTransaction[]> {
  // if the token is zero address, it means there's no need for approval
  if (token === AddressZero) {
    return [];
  }

  const amountInBigNumber: BigNumber = ethers.BigNumber.from(amount);

  const contract = new ethers.Contract(token, erc20TokenABI, account.signer);

  let allowance: BigNumber = ethers.BigNumber.from(0);
  let userBalance: BigNumber = ethers.BigNumber.from(0);
  let amountForHuman: string;
  let symbol: string = 'tokens'
  try {
    allowance = await contract.allowance(account.address, spender);
    userBalance = await contract.balanceOf(account.address);
    // transfer from big number(including decimals * 0) to human readable
    const decimals = await contract.decimals();
    amountForHuman = ethers.utils.formatUnits(amount, decimals);
  } catch (err) {
    // contract address might not have `allowance` or balanceOf on it.
    // TODO: track it with sentry
    throw new Error(`Contract ${token} doesn't seem to be ERC20 compliant.`);
  }

  try {
    // symbol is optional ERC token
    symbol = await contract.symbol();
  } catch {}

  // user balance is less than the amount that needs approval.
  // this means user won't be able to approve full amount.
  if (userBalance.lt(amountInBigNumber)) {
    throw new Error(`You need ${amountForHuman} ${symbol} for this transaction.`);
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
    message: `Approves ${amountForHuman} ${symbol} for ${spender} on ${token}`,
    status: CustomTransactionStatus.Pending,
  };

  // we currently only return 1 transaction, though it might be needed that this function takes care
  // of zero approval first and then the amount approval.
  return [transaction];
}
