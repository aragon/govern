/* eslint-disable */
import QueueApproval from './QueueApprovals'
import { ProposalParams, Proposal } from '@aragon/govern'
import { CustomTransaction, CustomTransactionStatus } from 'utils/types';

export default class FacadeProposal {

    constructor(private queueApproval:QueueApproval, private proposal: Proposal) {
        // Copy proposal's functions into this class.
        for (let func of Object.getOwnPropertyNames(this.proposal.constructor.prototype)) {
            // @ts-ignore
            this[func] = this.proposal.constructor.prototype[func].bind(this.proposal)
        }
    }   

    public async challenge(container:ProposalParams, reason:any) {
        let txs: CustomTransaction[] = [];
        try {
            txs = await this.queueApproval.scheduleApprovals(
                container.config.challengeDeposit
            )
        }catch(err) {
            throw err;
        }

        const challengeTransaction: CustomTransaction = {
            tx: () => {
              return this.proposal.challenge(
                container,
                reason,
              );
            },
            message: 'Challenges a proposal',
            status: CustomTransactionStatus.Pending,
        };

        txs = [
            ...txs,
            challengeTransaction
        ]

        return txs;
    }


    public async schedule(container: ProposalParams) {
        let txs: CustomTransaction[] = [];
        try {
            txs = await this.queueApproval.scheduleApprovals(
                container.config.scheduleDeposit
            )
        }catch(error) {
            throw error;
        }

        const scheduleTransaction: CustomTransaction = {
            tx: () => {
                return this.proposal.schedule(container);
            },
            message: 'Schedules a proposal',
            status: CustomTransactionStatus.Pending,
        };
    
        txs = [
            ...txs,
            scheduleTransaction
        ]
        return txs;
    }

}