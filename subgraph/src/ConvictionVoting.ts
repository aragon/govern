/* eslint-disable @typescript-eslint/no-use-before-define */
import { Address, BigInt, log } from '@graphprotocol/graph-ts'
import {
  ProposalAdded as ProposalAddedEvent,
  StakeAdded as StakeAddedEvent,
  StakeWithdrawn as StakeWithdrawnEvent,
  ProposalExecuted as ProposalExecutedEvent,
} from '../generated/templates/ConvictionVoting/ConvictionVoting'
import { Proposal as ProposalEntity } from '../generated/schema'
import {
  getProposalEntity,
  getStakeEntity,
  getStakeHistoryEntity,
  getOrgAddress,
} from './helpers'

export function handleProposalAdded(event: ProposalAddedEvent): void {
  const proposal = getProposalEntity(event.address, event.params.id)

  proposal.appAddress = event.address
  proposal.orgAddress = getOrgAddress(event.address)

  _populateProposalDataFromEvent(proposal, event)

  proposal.save()
}

export function handleStakeAdded(event: StakeAddedEvent): void {
  _onNewStake(
    event.address,
    event.params.entity,
    event.params.id,
    event.params.tokensStaked,
    event.params.totalTokensStaked,
    event.params.conviction,
    event.block.number
  )
}

export function handleStakeWithdrawn(event: StakeWithdrawnEvent): void {
  _onNewStake(
    event.address,
    event.params.entity,
    event.params.id,
    event.params.tokensStaked,
    event.params.totalTokensStaked,
    event.params.conviction,
    event.block.number
  )
}

export function handleProposalExecuted(event: ProposalExecutedEvent): void {
  const proposal = getProposalEntity(event.address, event.params.id)
  proposal.executed = true

  proposal.save()
}

function _onNewStake(
  appAddress: Address,
  entity: Address,
  proposalId: BigInt,
  tokensStaked: BigInt,
  totalTokensStaked: BigInt,
  conviction: BigInt,
  blockNumber: BigInt
): void {
  const proposal = getProposalEntity(appAddress, proposalId)

  // Hotfix: Orgs managed to stake to non existing proposals 
  if (proposal.creator.toHexString() == '0x') {
    return 
  }

  proposal.totalTokensStaked = totalTokensStaked

  _updateProposalStakes(proposal, entity, tokensStaked)
  _updateStakeHistory(
    proposal,
    appAddress,
    entity,
    tokensStaked,
    totalTokensStaked,
    conviction,
    blockNumber
  )
}

function _populateProposalDataFromEvent(
  proposal: ProposalEntity | null,
  event: ProposalAddedEvent
): void {
  proposal.name = event.params.title
  proposal.link = event.params.link.toString()
  proposal.requestedAmount = event.params.amount
  proposal.creator = event.params.entity
  proposal.beneficiary = event.params.beneficiary
}

function _updateProposalStakes(
  proposal: ProposalEntity | null,
  entity: Address,
  tokensStaked: BigInt
): void {
  const stake = getStakeEntity(proposal, entity)
  stake.amount = tokensStaked

  const stakes = proposal.stakes
  stakes.push(stake.id)
  proposal.stakes = stakes

  stake.save()
  proposal.save()
}

function _updateStakeHistory(
  proposal: ProposalEntity | null,
  appAddress: Address,
  entity: Address,
  tokensStaked: BigInt,
  totalTokensStaked: BigInt,
  conviction: BigInt,
  blockNumber: BigInt
): void {
  const stakeHistory = getStakeHistoryEntity(proposal, entity, blockNumber)

  stakeHistory.tokensStaked = tokensStaked
  stakeHistory.totalTokensStaked = totalTokensStaked
  stakeHistory.conviction = conviction
  stakeHistory.appAddress = appAddress
  stakeHistory.orgAddress = getOrgAddress(appAddress)

  stakeHistory.save()
}
