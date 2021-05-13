/* eslint-disable */
import { CourtABI } from 'utils/abis/court';
import { ethers } from 'ethers';
import { TokenDeposit } from '@aragon/govern';

import { erc20ApprovalTransaction } from 'utils/transactionHelper';
import { CustomTransaction } from 'utils/types';
import { Account } from 'utils/types';

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

    const contract = new ethers.Contract(this.resolver, CourtABI, this.account.signer);

    // add approval transaction for the challenge deposit token
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

    // add approval transaction for the fee token from the aragon's court
    const [, feeToken, feeAmount] = await contract.getDisputeFees();
    try {
      const approvalTransactions = await erc20ApprovalTransaction(
        feeToken,
        feeAmount,
        this.queue,
        this.account,
      );
      transactionsQueue = [...transactionsQueue, ...approvalTransactions];
    } catch (error) {
      throw new Error(error);
    }

    return transactionsQueue;
  }
}
