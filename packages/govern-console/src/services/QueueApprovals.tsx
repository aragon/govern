import { CourtABI } from 'abis/court';
import { ethers } from 'ethers';
import { TokenDeposit } from '@aragon/govern';

import { erc20ApprovalTransaction } from 'utils/transactionHelper';
import { CustomTransaction } from 'utils/types';
import { Account } from 'utils/types';
import { toBigNum } from 'utils/lib';

export default class QueueApprovals {
  constructor(private account: Account, private queue: string, private resolver: string) {}

  /**
   * @param scheduleDepositToken token to approve
   * @param scheduleDepositAmount how much to approve
   *
   * @returns {Promise<CustomTransaction[]>} All the necessary approval transactions
   */
  public async scheduleApprovals(tokenDeposit: TokenDeposit) {
    let transactionsQueue: CustomTransaction[] = [];
    try {
      const approvalTransactions = await erc20ApprovalTransaction(
        tokenDeposit.token,
        tokenDeposit.amount,
        this.queue,
        this.account,
      );
      transactionsQueue = [...transactionsQueue, ...approvalTransactions];
    } catch (error) {
      throw new Error(error);
    }

    return transactionsQueue;
  }

  /**
   * @param challengeDepositToken token to approve
   * @param challengeDepositAmount how much to approve
   *
   * @returns {Promise<CustomTransaction[]>} All the necessary approval transactions
   */
  public async challengeApprovals(tokenDeposit: TokenDeposit) {
    let transactionsQueue: CustomTransaction[] = [];

    const resolver = new ethers.Contract(this.resolver, CourtABI, this.account.signer);
    const [, feeToken, feeAmount] = await resolver.getDisputeFees();

    let approvalTransactions = [];

    try {
      // if equal, we need to approve only one time...
      if (feeToken.toLowerCase() === tokenDeposit.token.toLowerCase()) {
        approvalTransactions = await erc20ApprovalTransaction(
          feeToken,
          toBigNum(tokenDeposit.amount).add(feeAmount),
          this.queue,
          this.account,
        );
        return [...approvalTransactions];
      }

      // add approval transaction for the challenge deposit token
      approvalTransactions = await erc20ApprovalTransaction(
        tokenDeposit.token,
        tokenDeposit.amount,
        this.queue,
        this.account,
      );
      transactionsQueue = [...transactionsQueue, ...approvalTransactions];

      // add approval transaction for the fee token from the aragon's court
      approvalTransactions = await erc20ApprovalTransaction(
        feeToken,
        feeAmount,
        this.queue,
        this.account,
      );
      transactionsQueue = [...transactionsQueue, ...approvalTransactions];

      return transactionsQueue;
    } catch (error) {
      throw new Error(error);
    }
  }
}
