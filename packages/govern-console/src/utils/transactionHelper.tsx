import { CustomTransaction, Response } from 'utils/types';
import { ethers, BigNumber } from 'ethers';
import { erc20TokenABI } from 'utils/abis/erc20';

export async function erc20ApprovalTransaction(
  token: string,
  amount: string,
  spender: string,
  ethersProvider: any,
  account: string,
  feeTokenFunctionName?: any,
  // contract?: any,
): Promise<Response> {
  const response: Response = {
    isUserBalanceLow: false,
    isCollateralApproved: false,
    errorMessage: undefined,
    transactions: [],
  };
  const amountInBigNumber: BigNumber = ethers.BigNumber.from(amount);
  // if (!contract) {
  const contract = new ethers.Contract(
    token,
    erc20TokenABI,
    ethersProvider.getSigner(),
  );
  // }
  let allowance: BigNumber;

  if (feeTokenFunctionName) {
    allowance = await contract.allowed(account, spender);
  } else {
    allowance = await contract.allowance(account, spender);
  }
  const userBalance: BigNumber = await contract.balanceOf(account);
  // const userBalanceInNumber = userBalance.toNumber();
  console.log('user balance', userBalance);
  if (userBalance.gt(amountInBigNumber)) {
    const remainingAmountToApprove: BigNumber = amountInBigNumber.sub(
      allowance,
    );
    if (remainingAmountToApprove.gt(0x00)) {
      const transaction: CustomTransaction = {
        tx: () => {
          return contract.approve(spender, remainingAmountToApprove);
        },
        msg: `Approves ${remainingAmountToApprove} Tokens for the ${spender}`,
      };
      response.transactions.push(transaction);
    } else {
      response.isCollateralApproved = true;
    }
  } else {
    response.isUserBalanceLow = true;
    response.errorMessage = `You need ${amount} to schedule this proposal.`;
  }
  return response;
}
