/* eslint-disable */
import QueueApproval from './QueueApprovals';
import { ProposalParams, Proposal, DaoConfig } from '@aragon/govern';
import { CustomTransaction, CustomTransactionStatus } from 'utils/types';
import { buildContainer, Payload } from 'utils/ERC3000';

export default class FacadeProposal {
  constructor(private queueApproval: QueueApproval, private proposal: Proposal) {
    // Copy proposal's functions into this class.
    for (const func of Object.getOwnPropertyNames(this.proposal.constructor.prototype)) {
      // make sure we don't override methods from proposal.
      if (!Object.getOwnPropertyNames(this.constructor.prototype).includes(func)) {
        // @ts-ignore
        this[func] = this.proposal.constructor.prototype[func].bind(this.proposal);
      }
    }
  }

  public async challenge(container: ProposalParams, reason: string) {
    let txs: CustomTransaction[] = [];
    try {
      txs = await this.queueApproval.challengeApprovals(container.config.challengeDeposit);
    } catch (err) {
      throw err;
    }

    const challengeTransaction: CustomTransaction = {
      tx: () => {
        return this.proposal.challenge(container, reason);
      },
      message: 'Challenge execution',
      status: CustomTransactionStatus.Pending,
    };

    txs = [...txs, challengeTransaction];

    return txs;
  }

  public async schedule(payload: Payload, config: DaoConfig) {
    let txs: CustomTransaction[] = [];
    try {
      txs = await this.queueApproval.scheduleApprovals(config.scheduleDeposit);
    } catch (error) {
      throw error;
    }

    const scheduleTransaction: CustomTransaction = {
      tx: () => {
        const container = buildContainer(payload, config);
        return this.proposal.schedule(container);
      },
      message: 'Schedule execution',
      status: CustomTransactionStatus.Pending,
    };

    txs = [...txs, scheduleTransaction];
    return txs;
  }

  public async execute(container: ProposalParams) {
    const executeTransaction: CustomTransaction = {
      tx: () => {
        return this.proposal.execute(container);
      },
      message: 'Execute',
      status: CustomTransactionStatus.Pending,
    };

    return [executeTransaction];
  }

  public async resolve(container: ProposalParams, disputeId: number) {
    const resolveTransaction: CustomTransaction = {
      tx: () => {
        return this.proposal.resolve(container, disputeId);
      },
      message: 'Resolves a proposal',
      status: CustomTransactionStatus.Pending,
    };

    return [resolveTransaction];
  }
}
