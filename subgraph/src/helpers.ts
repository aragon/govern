import { Address, BigInt, Bytes, ByteArray } from '@graphprotocol/graph-ts'
import {
  Config as ConfigEntity,
  Proposal as ProposalEntity,
  Stake as StakeEntity,
  StakeHistory as StakeHistoryEntity,
  Token as TokenEntity,
} from '../generated/schema'
import { MiniMeToken as MiniMeTokenContract } from '../generated/templates/MiniMeToken/MiniMeToken'
import { ConvictionVoting as ConvictionVotingContract } from '../generated/templates/ConvictionVoting/ConvictionVoting'

function loadTokenData(address: Address): void {
  const tokenContract = MiniMeTokenContract.bind(address)
  const token = new TokenEntity(address.toHexString())

  token.name = tokenContract.name()
  token.symbol = tokenContract.symbol()
  token.decimals = tokenContract.decimals()

  token.save()
}

function getConfigEntityId(appAddress: Address): string {
  return appAddress.toHexString()
}

function getConfigEntity(appAddress: Address): ConfigEntity | null {
  const configEntityId = getConfigEntityId(appAddress)

  let config = ConfigEntity.load(configEntityId)

  if (!config) {
    config = new ConfigEntity(configEntityId)
  }

  return config
}

export function loadAppConfig(appAddress: Address): void {
  const config = getConfigEntity(appAddress)
  const convictionVoting = ConvictionVotingContract.bind(appAddress)

  // Load tokens data
  const stakeToken = convictionVoting.stakeToken()
  loadTokenData(stakeToken)
  const requestToken = convictionVoting.requestToken()
  loadTokenData(requestToken)

  config.stakeToken = stakeToken.toHexString()
  config.requestToken = requestToken.toHexString()

  // Load conviction params
  config.decay = convictionVoting.decay()
  config.pctBase = convictionVoting.D()
  config.weight = convictionVoting.weight()
  config.maxRatio = convictionVoting.maxRatio()

  config.appAddress = appAddress
  config.orgAddress = convictionVoting.kernel()

  config.save()
}

export function getProposalEntityId(
  appAddress: Address,
  proposalId: BigInt
): string {
  return (
    'appAddress:' +
    appAddress.toHexString() +
    '-proposalId:' +
    proposalId.toHexString()
  )
}

export function getProposalEntity(
  appAddress: Address,
  proposalId: BigInt
): ProposalEntity | null {
  const proposalEntityId = getProposalEntityId(appAddress, proposalId)

  let proposal = ProposalEntity.load(proposalEntityId)
  if (!proposal) {
    proposal = new ProposalEntity(proposalEntityId)
    proposal.number = proposalId
    proposal.stakes = []
    proposal.executed = false
    proposal.totalTokensStaked = BigInt.fromI32(0)
    proposal.creator = Bytes.fromHexString('0x') as Bytes
  }

  return proposal
}

export function getStakeEntityId(proposalId: BigInt, entity: Bytes): string {
  return proposalId.toHexString() + '-entity:' + entity.toHexString()
}

export function getStakeEntity(
  proposal: ProposalEntity | null,
  entity: Bytes
): StakeEntity | null {
  const stakeId = getStakeEntityId(proposal.number, entity)

  let stake = StakeEntity.load(stakeId)
  if (!stake) {
    stake = new StakeEntity(stakeId)
    stake.entity = entity
    stake.proposal = proposal.id
  }

  return stake
}
export function getStakeHistoryEntityId(
  proposalId: BigInt,
  entity: Bytes,
  timestamp: BigInt
): string {
  return (
    proposalId.toHexString() +
    '-entity:' +
    entity.toHexString() +
    '-time:' +
    timestamp.toString()
  )
}

export function getStakeHistoryEntity(
  proposal: ProposalEntity | null,
  entity: Bytes,
  blockNumber: BigInt
): StakeHistoryEntity | null {
  const stakeHistoryId = getStakeHistoryEntityId(
    proposal.number,
    entity,
    blockNumber
  )

  const stakeHistory = new StakeHistoryEntity(stakeHistoryId)
  stakeHistory.proposalId = proposal.number
  stakeHistory.entity = entity
  stakeHistory.time = blockNumber

  return stakeHistory
}

export function getOrgAddress(appAddress: Address): Address {
  const convictionVoting = ConvictionVotingContract.bind(appAddress)
  return convictionVoting.kernel()
}
