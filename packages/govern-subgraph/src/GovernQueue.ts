import { Address, Bytes, ethereum } from '@graphprotocol/graph-ts'
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
  Collateral as CollateralEntity,
  Config as ConfigEntity,
  Container as ContainerEntity,
  ContainerPayload as PayloadEntity,
  GovernQueue as GovernQueueEntity
} from '../generated/schema'
import { frozenRoles, roleGranted, roleRevoked } from './lib/MiniACL'
import { buildId, buildIndexedId } from './utils/ids'
import {
  APPROVED_STATUS,
  CANCELLED_STATUS,
  CHALLENGED_STATUS,
  EXECUTED_STATUS,
  NONE_STATUS,
  REJECTED_STATUS,
  SCHEDULED_STATUS,
  CHALLENGE_CONTAINER_EVENT,
  SUBMIT_EVIDENCE_CONTAINER_EVENT,
  RESOLVE_CONTAINER_EVENT,
  RULE_CONTAINER_EVENT,
  SCHEDULE_CONTAINER_EVENT,
  VETO_CONTAINER_EVENT,
  ALLOW_RULING
} from './utils/constants'
import { handleContainerEvent } from './utils/events'

export function handleScheduled(event: ScheduledEvent): void {
  const queue = loadOrCreateQueue(event.address)
  const payload = loadOrCreatePayload(event.params.containerHash)
  const container = loadOrCreateContainer(event.params.containerHash)
  // Builds each of the actions bundled in the payload,
  // and saves them to the DB.
  buildActions(event)
  payload.nonce = event.params.payload.nonce
  payload.executionTime = event.params.payload.executionTime
  payload.submitter = event.params.payload.submitter
  payload.executor = event.params.payload.executor.toHexString()
  payload.allowFailuresMap = event.params.payload.allowFailuresMap
  payload.proof = event.params.payload.proof
  container.payload = payload.id

  container.state = SCHEDULED_STATUS
  // This should always be possible, as a queue without a config
  // should be impossible to get at this stage
  container.config = queue.config

  handleContainerEvent(
    container,
    event.block.timestamp,
    SCHEDULE_CONTAINER_EVENT,
    [
      event.params.collateral.token.toHex(),
      event.params.collateral.amount.toHex()
    ]
  )

  // add the container to the queue
  const scheduled = queue.queued
  scheduled.push(container.id)
  queue.queued = scheduled

  payload.save()
  container.save()
  queue.save()
}

export function handleExecuted(event: ExecutedEvent): void {
  const container = loadOrCreateContainer(event.params.containerHash)
  container.state = EXECUTED_STATUS
  container.save()
}

export function handleChallenged(event: ChallengedEvent): void {
  const queue = loadOrCreateQueue(event.address)
  const container = loadOrCreateContainer(event.params.containerHash)

  container.state = CHALLENGED_STATUS

  handleContainerEvent(
    container,
    event.block.timestamp,
    CHALLENGE_CONTAINER_EVENT,
    [
      event.params.actor.toHex(),
      event.params.reason.toHex(),
      ConfigEntity.load(queue.config).resolver.toHex(),
      event.params.resolverId.toHex(),
      event.params.collateral.token.toHex(),
      event.params.collateral.amount.toHex()
    ]
  )

  container.save()
  queue.save()
}

export function handleResolved(event: ResolvedEvent): void {
  const container = loadOrCreateContainer(event.params.containerHash)

  container.state = event.params.approved ? EXECUTED_STATUS : CANCELLED_STATUS

  handleContainerEvent(
    container,
    event.block.timestamp,
    RESOLVE_CONTAINER_EVENT,
    [event.params.approved ? 'approved' : 'cancelled']
  )

  container.save()
}

export function handleVetoed(event: VetoedEvent): void {
  const queue = loadOrCreateQueue(event.address)
  const container = loadOrCreateContainer(event.params.containerHash)

  container.state = CANCELLED_STATUS

  handleContainerEvent(container, event.block.timestamp, VETO_CONTAINER_EVENT, [
    event.params.reason.toHex()
  ])

  container.save()
  queue.save()
}

export function handleConfigured(event: ConfiguredEvent): void {
  const queue = loadOrCreateQueue(event.address)

  const configId = buildId(event)
  const config = new ConfigEntity(configId)

  const scheduleDeposit = loadOrCreateCollateral(event, 1)
  scheduleDeposit.token = event.params.config.scheduleDeposit.token
  scheduleDeposit.amount = event.params.config.scheduleDeposit.amount

  const challengeDeposit = loadOrCreateCollateral(event, 2)
  challengeDeposit.token = event.params.config.challengeDeposit.token
  challengeDeposit.amount = event.params.config.challengeDeposit.amount

  const vetoDeposit = loadOrCreateCollateral(event, 3)
  vetoDeposit.token = event.params.config.vetoDeposit.token
  vetoDeposit.amount = event.params.config.vetoDeposit.amount

  config.queue = queue.id
  config.executionDelay = event.params.config.executionDelay
  config.scheduleDeposit = scheduleDeposit.id
  config.challengeDeposit = challengeDeposit.id
  config.vetoDeposit = vetoDeposit.id
  config.resolver = event.params.config.resolver
  config.rules = event.params.config.rules

  queue.config = config.id

  scheduleDeposit.save()
  challengeDeposit.save()
  vetoDeposit.save()
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
  const container = loadOrCreateContainer(containerHash)

  handleContainerEvent(
    container,
    event.block.timestamp,
    SUBMIT_EVIDENCE_CONTAINER_EVENT,
    [event.params.submitter.toHex(), event.params.evidence.toHex()]
  )
}

export function handleRuled(event: RuledEvent): void {
  const governQueue = GovernQueueContract.bind(event.address)
  const containerHash = governQueue.disputeItemCache(
    event.params.arbitrator,
    event.params.disputeId
  )
  const container = loadOrCreateContainer(containerHash)

  container.state =
    event.params.ruling === ALLOW_RULING ? APPROVED_STATUS : REJECTED_STATUS

  handleContainerEvent(container, event.block.timestamp, RULE_CONTAINER_EVENT, [
    event.params.ruling.toHex()
  ])

  container.save()
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
    queue.config = ''
    queue.queued = []
    queue.challenged = []
    queue.roles = []
  }
  return queue!
}

export function loadOrCreateContainer(containerHash: Bytes): ContainerEntity {
  const ContainerId = containerHash.toHexString()
  // Create container
  let container = ContainerEntity.load(ContainerId)
  if (container === null) {
    container = new ContainerEntity(ContainerId)
    container.state = NONE_STATUS
    container.history = []
  }
  return container!
}

function loadOrCreatePayload(containerHash: Bytes): PayloadEntity {
  const PayloadId = containerHash.toHexString()
  // Create payload
  let payload = PayloadEntity.load(PayloadId)
  if (payload === null) {
    payload = new PayloadEntity(PayloadId)
  }
  return payload!
}

function loadOrCreateCollateral(
  event: ethereum.Event,
  index: number
): CollateralEntity {
  const collateralId = buildIndexedId(
    event.transaction.hash.toHexString(),
    index
  )
  // Create collateral
  let collateral = CollateralEntity.load(collateralId)
  if (collateral === null) {
    collateral = new CollateralEntity(collateralId)
  }
  return collateral!
}

function buildActions(event: ScheduledEvent): void {
  const actions = event.params.payload.actions
  for (let index = 0; index < actions.length; index++) {
    const actionId = buildIndexedId(
      event.params.containerHash.toHexString(),
      index
    )
    const action = new ActionEntity(actionId)

    action.to = actions[index].to
    action.value = actions[index].value
    action.data = actions[index].data
    action.payload = event.params.containerHash.toHexString()

    action.save()
  }
}
