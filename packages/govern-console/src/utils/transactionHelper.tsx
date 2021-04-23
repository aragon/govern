import { CustomTransaction, Response } from 'utils/types';
import { ethers, BigNumber } from 'ethers';
import { erc20TokenABI } from 'utils/abis/erc20';

export async function erc20ApprovalTransaction(
  token: string,
  amount: string,
  spender: string,
  ethersProvider: any,
  account: string,
): Promise<Response> {
  const response: Response = {
    isUserBalanceLow: false,
    isCollateralApproved: false,
    errorMessage: undefined,
    transactions: [],
  };
  const amountInBigNumber: BigNumber = ethers.BigNumber.from(amount);

  const contract = new ethers.Contract(
    token,
    erc20TokenABI,
    ethersProvider.getSigner(),
  );

  const allowance = await contract.allowance(account, spender);

  const userBalance: BigNumber = await contract.balanceOf(account);
  // user balance is less than the amount that needs approval.
  // this means user won't be able to approve full amount.
  if (userBalance.lt(amountInBigNumber)) {
    response.isUserBalanceLow = true;
    response.errorMessage = `You need ${amount} to schedule this proposal.`;
    return response;
  }
  // user has enough balance, but also already got amountInBigNumber approved for spender
  if (allowance.gte(amountInBigNumber)) {
    response.isCollateralApproved = true;
    return response;
  }
  // approve amountInBigNumber for the spender
  const transaction: CustomTransaction = {
    tx: () => {
      return contract.approve(spender, amountInBigNumber);
    },
    msg: `Approves ${amountInBigNumber} Tokens for the ${spender}`,
  };
  response.transactions.push(transaction);
  return response;
}
