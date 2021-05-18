import { DaoConfig, ContainerConfig } from './createDao'
import {
  ContractInterface,
  Contract,
  providers,
  BigNumberish,
  utils,
  ContractTransaction,
  ContractReceipt,
} from 'ethers'

const Payload = `
  tuple(
    uint256 nonce,
    uint256 executionTime,
    address submitter,
    address executor,
    tuple(
      address to,
      uint256 value,
      bytes data
    )[] actions,
    bytes32 allowFailuresMap,
    bytes proof
  )
`

export const Container = `
  tuple(
    ${Payload} payload,
    ${ContainerConfig} config
  )
`
const Collateral = `
  tuple(
    address token,
    uint256 amount
  ) collateral
`

const queueAbis = [
  `function nonce() view returns (uint256)`,
  `function schedule(${Container} _container)`,
  `function execute(${Container} _container)`,
  `function challenge(${Container} _container, bytes _reason)`,
  `function resolve(${Container} _container, uint256 _disputeId)`,
  `function veto(${Container} _container, bytes _reason)`,
  `function configure(${ContainerConfig} _config)`,
  `event Challenged(bytes32 indexed containerHash, address indexed actor, bytes reason, uint256 resolverId, ${Collateral})`,
  `event Scheduled(bytes32 indexed containerHash, ${Payload} payload)`,
  `event Executed(bytes32 indexed containerHash, address indexed actor)`,
  `event Resolved(bytes32 indexed containerHash, address indexed actor, bool approved)`,
  `event Vetoed(bytes32 indexed containerHash, address indexed actor, bytes reason)`,
  `event Configured(bytes32 indexed configHash, address indexed actor, ${ContainerConfig} config)`
]

declare let window: any

export type ProposalOptions = {
  provider?: any
  abi?: ContractInterface
}

export type ProposalParams = {
  payload: PayloadType
  config: DaoConfig
}

export type PayloadType = {
  nonce?: BigNumberish
  executionTime: BigNumberish
  submitter: string
  executor: string
  actions: ActionType[]
  allowFailuresMap: utils.BytesLike
  proof: utils.BytesLike
}

export type ActionType = {
  to: string
  value: BigNumberish
  data: utils.BytesLike
}

export enum ReceiptType {
  Scheduled = 'Scheduled',
  Challenged = 'Challenged',
  Executed = 'Executed',
  Resolved = 'Resolved',
  Vetoed = 'Vetoed'
}

export class Proposal {
  private readonly contract: Contract
  private readonly interface: any

  constructor(queueAddress: string, options: ProposalOptions) {
    const abi: any = options?.abi || queueAbis // TODO instead of any, put Fragment|JSONFragment from ethers

    const provider = options.provider || window.ethereum
    const signer = new providers.Web3Provider(provider).getSigner()
    this.contract = new Contract(queueAddress, abi, signer)
    this.interface = new utils.Interface(abi)
  }

  /**
   * Create and schedule a proposal
   *
   * @param {ProposalParams} proposal for creating and scheduling a DAO proposal
   *
   * @returns {Promise<ContractTransaction>} transaction response object
   */
  async schedule(proposal: ProposalParams): Promise<ContractTransaction> {
    const nonce = await this.contract.nonce()

    const proposalWithNonce = Object.assign({}, proposal)
    proposalWithNonce.payload.nonce = nonce.add(1)
    const result = this.contract.schedule(proposalWithNonce)
    return result
  }

  /**
   * Execute a proposal
   *
   * @param {ProposalParams} proposal to execute
   *
   * @returns {Promise<ContractTransaction>} constract response object
   */
  async execute(proposal: ProposalParams): Promise<ContractTransaction> {
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
   * @returns {Promise<ContractTransaction>} constract response object
   */
  async veto(proposal: ProposalParams, reason: string): Promise<ContractTransaction> {
    const reasonBytes = utils.toUtf8Bytes(reason)
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
   * @returns {Promise<ContractTransaction>} constract response object
   */
  async resolve(proposal: ProposalParams, disputeId: number): Promise<ContractTransaction> {
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
   * @returns {Promise<ContractTransaction>} constract response object
   */
  async challenge(proposal: ProposalParams, reason: utils.BytesLike): Promise<ContractTransaction> {
    // const reasonBytes = utils.toUtf8Bytes(reason)
    const result = this.contract.challenge(proposal, reason)
    return result
  }

  /**
   * Build an Action
   *
   * @param {string} name
   *
   * @param {any} parameters
   *
   * @param {number|string} value
   *
   * @returns {any}
   */
  buildAction(name: string, parameters: any, value: number | string): any {
    return {
      data: this.interface.encodeFunctionData(name, parameters),
      to: this.contract.address,
      value: value,
    }
  }

  /**
   * @param name function name of the govern queue abi
   *
   * @returns {string} the signature of the function
   */
  getSigHash(name: string): string {
    return this.interface.getSighash(name)
  }

  /**
   * Get the disputeId from a challenge proposal receipt
   *
   * @param {TransactionReceipt} receipt from the challenged proposal
   *
   * @returns {number|null>} transaction response object
   */
  getDisputeId(receipt: providers.TransactionReceipt): number | null {
    const args = receipt.logs
      .filter(
        ({ address }: { address: string }) => address === this.contract.address
      )
      .map((log: any) => this.contract.interface.parseLog(log))
      .find(({ name }: { name: string }) => name === 'Challenged')

    const rawDisputeId = args?.args[3]
    const disputeId = rawDisputeId ? rawDisputeId.toNumber() : null

    return disputeId
  }

  /**
   * Get the container hash from the receipt for the given receipt type
   *
   * @param {ContractReceipt} receipt from the contract transaction call
   * @param {ReceiptType} receiptType the type of receipt, i.e. Scheduled, Challenged, Executed
   * @returns {string | undefined} containerHash
   */
  static getContainerHashFromReceipt(receipt: ContractReceipt, receiptType: ReceiptType): string | undefined {
    return receipt.events?.find(e => e.event === receiptType)?.args?.containerHash
  }
}
