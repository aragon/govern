import { ethers } from 'ethers'
import * as abi from '../internal/abi/GovernQueue.json'

declare let window: any;

export type ProposalOptions = {
  provider?: any
}

export type ProposalParams = {
  payload: PayloadType
  config: ConfigType
}

export type PayloadType = {
  nonce: ethers.BigNumberish
  executionTime: ethers.BigNumberish
  submitter: string
  executor: string
  actions: ActionType[]
  allowFailuresMap: string
  proof: string
}

export type ConfigType = {
  executionDelay: ethers.BigNumberish
  scheduleDeposit: CollateralType;
  challengeDeposit: CollateralType;
  vetoDeposit: CollateralType;
  resolver: string
  rules: string
}

export type CollateralType = {
  token: string
  amount: ethers.BigNumberish
}

export type ActionType = {
  to: string
  value?: ethers.BigNumberish
  data?: string
}


export class Proposal {
  private readonly queueAddress: string;
  private readonly signer: ethers.Signer;
  
  constructor (queueAddress: string, options: ProposalOptions) {
    this.queueAddress = queueAddress
    const provider = options.provider || window.ethereum
    this.signer = new ethers.providers.Web3Provider(provider).getSigner()
  }

/**
 * Create and schedule a proposal
 *
 * @param {ProposalParams} proposal for creating and scheduling a DAO proposal
 * 
 * @returns {Promise<TransactionResponse>} transaction response object
 */

  async schedule(proposal: ProposalParams): Promise<ethers.providers.TransactionResponse>
  {
    const contract = new ethers.Contract(this.queueAddress, abi, await this.signer)
    const result = contract.schedule(proposal)
    return result
  }

}

