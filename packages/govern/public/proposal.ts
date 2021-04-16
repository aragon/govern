import { ethers } from 'ethers'
import * as abi from '../internal/abi/GovernQueue.json'
import { DaoConfig } from './createDao'

declare let window: any;

export type ProposalOptions = {
  provider?: any
}

export type ProposalParams = {
  payload: PayloadType
  config: DaoConfig
}

export type PayloadType = {
  nonce: ethers.BigNumberish
  executionTime: ethers.BigNumberish
  submitter: string
  executor: string
  actions: ActionType[]
  allowFailuresMap: ethers.BytesLike
  proof: ethers.BytesLike
}

export type ActionType = {
  to: string
  value: ethers.BigNumberish
  data: ethers.BytesLike
}


export class Proposal {
  private readonly contract: ethers.Contract;
  
  constructor (queueAddress: string, options: ProposalOptions) {
    const provider = options.provider || window.ethereum
    const signer = (new ethers.providers.Web3Provider(provider)).getSigner()
    this.contract = new ethers.Contract(queueAddress, abi, signer)
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
    const result = this.contract.schedule(proposal)
    return result
  }

  /**
   * Execute a proposal
   *
   * @param {ProposalParams} proposal to execute
   *
   * @returns {Promise<TransactionResponse>} transaction response object
   */
  async execute(proposal: ProposalParams): Promise<ethers.providers.TransactionResponse>
  {
    const result = this.contract.execute(proposal)
    return result
  }

  /**
   * Veto a proposal
   *
   * @param {ProposalParams} proposal to veto
   *
   * @param {string} reason
   *
   * @returns {Promise<TransactionResponse>} transaction response object
   */
  async veto(proposal: ProposalParams, reason: string): Promise<ethers.providers.TransactionResponse>
  {
    const reasonBytes = ethers.utils.toUtf8Bytes(reason)
    const result = this.contract.veto(proposal, reasonBytes)
    return result
  }

  /**
   * Resolve a proposal
   *
   * @param {ProposalParams} proposal to resolve
   *
   * @param {number} disputeId
   *
   * @returns {Promise<TransactionResponse>} transaction response object
   */
  async resolve(proposal: ProposalParams, disputeId: number) : Promise<ethers.providers.TransactionResponse>
  {
    const result = this.contract.resolve(proposal, disputeId)
    return result
  }

  /**
   * Challenge a proposal
   *
   * @param {ProposalParams} proposal to challenge
   *
   * @param {string} reason
   *
   * @returns {Promise<TransactionResponse>} transaction response object
   */
  async challenge(proposal: ProposalParams, reason: string): Promise<ethers.providers.TransactionResponse>
  {
    const reasonBytes = ethers.utils.toUtf8Bytes(reason)
    const result = this.contract.challenge(proposal, reasonBytes)
    return result
  }

}

