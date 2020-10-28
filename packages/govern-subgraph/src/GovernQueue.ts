import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts'
import {
  Challenged as ChallengedEvent,
  Configured as ConfiguredEvent,
  Executed as ExecutedEvent,
  Frozen as FrozenEvent,
  Granted as GrantedEvent,
  Resolved as ResolvedEvent,
  Revoked as RevokedEvent,
  Scheduled as ScheduledEvent,
  Vetoed as VetoedEvent,
  Ruled as RuledEvent,
  EvidenceSubmitted as EvidenceSubmittedEvent,
  GovernQueue as GovernQueueContract
} from '../generated/templates/GovernQueue/GovernQueue'
import {
  Action as ActionEntity,
  Config as ConfigEntity,
  Challenge as ChallengeEntity,
  Collateral as CollateralEntity,
  Evidence as EvidenceEntity,
  QueuePacket as QueuePacketEntity,
  GovernQueue as GovernQueueEntity,
  ERC20 as ERC20Entity,
  Schedule as ScheduleEntity,
  Veto as VetoEntity
} from '../generated/schema'
import { frozenRoles, roleGranted, roleRevoked } from './lib/MiniACL'

const NONE_STATUS = 'None'
const APPROVED_STATUS = 'Approved'
const CANCELLED_STATUS = 'Cancelled'
const CHALLENGED_STATUS = 'Challenged'
const EXECUTED_STATUS = 'Executed'
const REJECTED_STATUS = 'Rejected'
const SCHEDULED_STATUS = 'Scheduled'
const VETOED_STATUS = 'Vetoed'

const ALLOW_RULING = BigInt.fromI32(4)

export function handleScheduled(event: ScheduledEvent): void {
  const queue = loadOrCreateQueue(event.address)

  const packet = loadOrCreateQueuePacket(event.params.containerHash, event)

  buildActions(event)

  packet.status = SCHEDULED_STATUS
  packet.nonce = event.params.payload.nonce
  packet.executionTime = event.params.payload.executionTime
  packet.submitter = event.params.payload.submitter
  packet.executor = event.params.payload.executor.toHexString()
  packet.allowFailuresMap = event.params.payload.allowFailuresMap
  packet.proof = event.params.payload.proof

  const schedule = new ScheduleEntity(event.params.containerHash.toHexString())

  const scheduleDeposit = loadOrCreateCollateral(event, '1')
  scheduleDeposit.token = buildERC20(event.params.collateral.token)
  scheduleDeposit.amount = event.params.collateral.amount

  schedule.packet = packet.id
  schedule.collateral = scheduleDeposit.id
  schedule.createdAt = event.block.timestamp

  // add the packet
  const scheduled = queue.scheduled
  scheduled.push(schedule.id)
  queue.scheduled = scheduled

  packet.save()
  schedule.save()
  queue.save()
}

export function handleExecuted(event: ExecutedEvent): void {
  const packet = loadOrCreateQueuePacket(event.params.containerHash, event)

  packet.status = EXECUTED_STATUS

  packet.save()
}

export function handleChallenged(event: ChallengedEvent): void {
  const queue = loadOrCreateQueue(event.address)

  const packet = loadOrCreateQueuePacket(event.params.containerHash, event)

  packet.status = CHALLENGED_STATUS

  const challenge = new ChallengeEntity(
    event.params.containerHash.toHexString()
  )

  const challengeDeposit = loadOrCreateCollateral(event, '2')
  challengeDeposit.token = buildERC20(event.params.collateral.token)
  challengeDeposit.amount = event.params.collateral.amount

  challenge.packet = packet.id
  challenge.challenger = event.params.actor
  challenge.arbitrator = loadOrCreateConfig(event.address).resolver
  challenge.disputeId = event.params.resolverId
  challenge.collateral = challengeDeposit.id
  challenge.createdAt = event.block.timestamp

  // add the challenged packet
  const challenged = queue.challenged
  challenged.push(challenge.id)
  queue.challenged = challenged

  packet.save()
  challenge.save()
  queue.save()
}

export function handleResolved(event: ResolvedEvent): void {
  const packet = loadOrCreateQueuePacket(event.params.containerHash, event)
  const challenge = ChallengeEntity.load(
    event.params.containerHash.toHexString()
  )

  packet.status = event.params.approved ? EXECUTED_STATUS : CANCELLED_STATUS

  challenge.approved = event.params.approved

  packet.save()
  challenge.save()
}

export function handleVetoed(event: VetoedEvent): void {
  const queue = loadOrCreateQueue(event.address)

  const packet = loadOrCreateQueuePacket(event.params.containerHash, event)

  packet.status = VETOED_STATUS

  const veto = new VetoEntity(event.params.containerHash.toHexString())

  veto.packet = packet.id
  veto.reason = event.params.reason
  veto.submitter = event.params.actor
  veto.createdAt = event.block.timestamp

  // add the veto packet
  const vetoed = queue.vetoed
  vetoed.push(veto.id)
  queue.vetoed = vetoed

  packet.save()
  veto.save()
  queue.save()
}

export function handleConfigured(event: ConfiguredEvent): void {
  const queue = loadOrCreateQueue(event.address)
  const config = loadOrCreateConfig(event.address)

  const scheduleDeposit = loadOrCreateCollateral(event, '1')
  scheduleDeposit.token = buildERC20(event.params.config.scheduleDeposit.token)
  scheduleDeposit.amount = event.params.config.scheduleDeposit.amount

  const challengeDeposit = loadOrCreateCollateral(event, '2')
  challengeDeposit.token = buildERC20(
    event.params.config.challengeDeposit.token
  )
  challengeDeposit.amount = event.params.config.challengeDeposit.amount

  config.executionDelay = event.params.config.executionDelay
  config.scheduleDeposit = scheduleDeposit.id
  config.challengeDeposit = challengeDeposit.id
  config.resolver = event.params.config.resolver
  config.rules = event.params.config.rules

  queue.config = config.id

  scheduleDeposit.save()
  challengeDeposit.save()
  config.save()
  queue.save()
}

// IArbitrable Events

export function handleEvidenceSubmitted(event: EvidenceSubmittedEvent): void {
  const governQueue = GovernQueueContract.bind(event.address)

  const containerHash = governQueue.disputeItemCache(
    event.params.arbitrator,
    event.params.disputeId
  )

  const evidenceId = buildId(event)
  const evidence = new EvidenceEntity(evidenceId)

  evidence.challenge = containerHash.toHexString()
  evidence.submitter = event.params.submitter
  evidence.data = event.params.evidence
  evidence.createdAt = event.block.timestamp

  evidence.save()
}

export function handleRuled(event: RuledEvent): void {
  const governQueue = GovernQueueContract.bind(event.address)

  const containerHash = governQueue.disputeItemCache(
    event.params.arbitrator,
    event.params.disputeId
  )

  const packet = loadOrCreateQueuePacket(containerHash, event)
  const challenge = ChallengeEntity.load(containerHash.toHexString())

  packet.status =
    event.params.ruling === ALLOW_RULING ? APPROVED_STATUS : REJECTED_STATUS
  challenge.ruling = event.params.ruling

  packet.save()
  challenge.save()
}

// MiniACL Events

export function handleFrozen(event: FrozenEvent): void {
  const queue = loadOrCreateQueue(event.address)

  const roles = queue.roles!

  frozenRoles(roles, event.params.role)
}

export function handleGranted(event: GrantedEvent): void {
  const queue = loadOrCreateQueue(event.address)

  const role = roleGranted(event.address, event.params.role, event.params.who)

  // add the role
  const currentRoles = queue.roles
  currentRoles.push(role.id)
  queue.roles = currentRoles

  queue.save()
}

export function handleRevoked(event: RevokedEvent): void {
  const queue = loadOrCreateQueue(event.address)

  const role = roleRevoked(event.address, event.params.role, event.params.who)

  // add the role
  const currentRoles = queue.roles
  currentRoles.push(role.id)
  queue.roles = currentRoles

  queue.save()
}

// Helpers

export function loadOrCreateQueue(entity: Address): GovernQueueEntity {
  const queueId = entity.toHexString()
  // Create queue
  let queue = GovernQueueEntity.load(queueId)
  if (queue === null) {
    queue = new GovernQueueEntity(queueId)
    queue.address = entity
    queue.scheduled = []
    queue.challenged = []
    queue.vetoed = []
    queue.roles = []
  }
  return queue!
}

function loadOrCreateConfig(entity: Address): ConfigEntity {
  const configId = entity.toHexString()
  // Create config
  let config = ConfigEntity.load(configId)
  if (config === null) {
    config = new ConfigEntity(configId)
    config.queue = entity.toHexString()
  }
  return config!
}

function loadOrCreateQueuePacket(
  containerHash: Bytes,
  event: ethereum.Event
): QueuePacketEntity {
  const PacketId = containerHash.toHexString()
  // Create packet
  let packet = QueuePacketEntity.load(PacketId)
  if (packet === null) {
    packet = new QueuePacketEntity(PacketId)
    packet.queue = event.address.toHexString()
    packet.status = NONE_STATUS
  }
  return packet!
}

function loadOrCreateCollateral(
  event: ethereum.Event,
  index: String
): CollateralEntity {
  const collateralId = event.transaction.hash.toHexString() + index
  // Create collateral
  let collateral = CollateralEntity.load(collateralId)
  if (collateral === null) {
    collateral = new CollateralEntity(collateralId)
  }
  return collateral!
}

function loadOrCreateChallenge(
  containerHash: Bytes,
  event: ethereum.Event
): ChallengeEntity {
  const challengeId = containerHash.toHexString()
  // Create challenge
  let challenge = ChallengeEntity.load(challengeId)
  if (challenge === null) {
    challenge = new ChallengeEntity(challengeId)
    challenge.createdAt = event.block.timestamp
  }
  return challenge!
}

function buildId(event: ethereum.Event): string {
  return event.transaction.hash.toHexString() + event.logIndex.toString()
}

function buildActionId(containerHash: Bytes, index: number): string {
  return containerHash.toHexString() + index.toString()
}

function buildActions(event: ScheduledEvent): void {
  const actions = event.params.payload.actions
  for (let id = 0; id < actions.length; id++) {
    const actionId = buildActionId(event.params.containerHash, id)
    const action = new ActionEntity(actionId)

    action.to = actions[id].to
    action.value = actions[id].value
    action.data = actions[id].data
    action.packet = event.params.containerHash.toHexString()

    action.save()
  }
}

export function buildERC20(address: Address): string {
  const id = address.toHexString()
  let token = ERC20Entity.load(id)

  if (token === null) {
    token = new ERC20Entity(id)
    token.address = address
    token.save()
  }

  return token.id
}
