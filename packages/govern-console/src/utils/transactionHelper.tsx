/* eslint-disable*/
import {
  CustomTransaction,
  Response,
  CustomTransactionStatus,
} from 'utils/types';
import { ethers, BigNumber } from 'ethers';
import { erc20TokenABI } from './abis/erc20';

export async function erc20ApprovalTransaction(
  token: string,
  amount: string,
  spender: string,
  ethersProvider: any,
  account: string,
): Promise<Response> {
  const response: Response = {
    error: undefined,
    transactions: [],
  };

  const amountInBigNumber: BigNumber = ethers.BigNumber.from(amount);

  const contract = new ethers.Contract(
    token,
    erc20TokenABI,
    ethersProvider.getSigner(),
  );

  let allowance: BigNumber = ethers.BigNumber.from(0);
  let userBalance: BigNumber = ethers.BigNumber.from(0);

  try {
    allowance = await contract.allowance(account, spender);
    userBalance = await contract.balanceOf(account);
  } catch (err) {
    // contract address could be 0x0000000..000 or might not have `allowance` or balanceOf on it.
    // TODO: if it's an address and not 0x000..00.., track it with sentry.
    response.error = `Contract ${token} doesn't seem to be ERC20 compliant.`;
  }

  // user balance is less than the amount that needs approval.
  // this means user won't be able to approve full amount.
  if (userBalance.lt(amountInBigNumber)) {
    response.error = `You need ${amount} to schedule this proposal.`;
    return response;
  }
  // user has enough balance, but also already got amountInBigNumber approved for spender
  if (allowance.gte(amountInBigNumber)) {
    return response;
  }
  // approve amountInBigNumber for the spender
  const transaction: CustomTransaction = {
    tx: () => {
      return contract.approve(spender, amountInBigNumber);
    },
    preTransactionMessage: `Approve ${amountInBigNumber} Tokens.`,
    transactionMessage: `Approving ${amountInBigNumber} Tokens.`,
    successMessage: `${amountInBigNumber} Tokens Approved`,
    errorMessage: `Error while approving ${amountInBigNumber} Tokens`,
    status: CustomTransactionStatus.Pending,
  };
  response.transactions.push(transaction);
  return response;
}
