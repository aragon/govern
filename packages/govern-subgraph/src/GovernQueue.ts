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
  GovernQueue as GovernQueueContract,
} from '../generated/templates/GovernQueue/GovernQueue'
import {
  Action as ActionEntity,
  Challenge as ChallengeEntity,
  Collateral as CollateralEntity,
  Config as ConfigEntity,
  Container as ContainerEntity,
  ContainerEvent as ContainerEventEntity,
  ContainerPayload as PayloadEntity,
  Evidence as EvidenceEntity,
  GovernQueue as GovernQueueEntity,
} from '../generated/schema'
import { frozenRoles, roleGranted, roleRevoked } from './lib/MiniACL'
import { buildId, buildActionId } from './mapping-utils'

const NONE_STATUS = 'None'
const SCHEDULED_STATUS = 'Scheduled'
const APPROVED_STATUS = 'Approved'
const CHALLENGED_STATUS = 'Challenged'
const REJECTED_STATUS = 'Rejected'
const CANCELLED_STATUS = 'Cancelled'
const EXECUTED_STATUS = 'Executed'

const SCHEDULE_CONTAINER_EVENT = 'Schedule'
const CHALLENGE_CONTAINER_EVENT = 'Challenge'
const APPROVE_CONTAINER_EVENT = 'Approve'
const REJECT_CONTAINER_EVENT = 'Reject'
const CANCEL_CONTAINER_EVENT = 'Cancel'
const EXECUTE_CONTAINER_EVENT = 'Execute'
const VETO_CONTAINER_EVENT = 'Veto'
const RULE_CONTAINER_EVENT = 'Rule'
const EVIDENCE_SUBMISSION_CONTAINER_EVENT = 'EvidenceSubmission'

const ALLOW_RULING = BigInt.fromI32(4)

export function handleScheduled(event: ScheduledEvent): void {
  const queue = loadOrCreateQueue(event.address)
  const payload = loadOrCreatePayload(event.params.containerHash)
  const container = loadOrCreateContainer(event.params.containerHash, event)
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

  const amountOfEvents = container.history.length
  const containerEvent = loadOrCreateContainerEvent(
    event.params.containerHash,
    amountOfEvents
  )
  const containerEventId = buildActionId(
    event.params.containerHash,
    amountOfEvents
  )
  containerEvent.createdAt = event.block.timestamp
  containerEvent.type = SCHEDULE_CONTAINER_EVENT
  containerEvent.data = []
  container.history = [containerEventId]

  container.state = SCHEDULED_STATUS
  // This should always be possible, as a queue without a config
  // should be impossible to get at this stage
  container.config = queue.config
  container.queue = queue.id

  // add the container to the queue
  const scheduled = queue.queued
  scheduled.push(container.id)
  queue.queued = scheduled

  containerEvent.save()
  payload.save()
  container.save()
  queue.save()
}

export function handleExecuted(event: ExecutedEvent): void {
  const container = loadOrCreateContainer(event.params.containerHash, event)
  container.state = EXECUTED_STATUS

  container.save()
}

export function handleChallenged(event: ChallengedEvent): void {
  const queue = loadOrCreateQueue(event.address)

  const container = loadOrCreateContainer(event.params.containerHash, event)
  container.state = CHALLENGED_STATUS

  const challenge = new ChallengeEntity(
    event.params.containerHash.toHexString()
  )

  const challengeDeposit = loadOrCreateCollateral(event, '2')
  challengeDeposit.token = event.params.collateral.token
  challengeDeposit.amount = event.params.collateral.amount

  challenge.container = container.id
  challenge.challenger = event.params.actor
  challenge.arbitrator = loadOrCreateConfig(event.address).resolver
  challenge.disputeId = event.params.resolverId
  challenge.collateral = challengeDeposit.id
  challenge.createdAt = event.block.timestamp

  // add the challenged payload
  const challenged = queue.challenged
  challenged.push(challenge.id)
  queue.challenged = challenged

  // Record this event on the container
  const amountOfEvents = container.history.length
  const containerEvent = loadOrCreateContainerEvent(
    event.params.containerHash,
    amountOfEvents
  )
  const containerEventId = buildActionId(
    event.params.containerHash,
    amountOfEvents
  )
  containerEvent.type = CHALLENGE_CONTAINER_EVENT
  containerEvent.createdAt = event.block.timestamp
  containerEvent.data = [event.params.actor.toHexString()]
  const containerEvents = container.history
  containerEvents.push(containerEventId)
  container.history = containerEvents

  challengeDeposit.save()
  containerEvent.save()
  container.save()
  challenge.save()
  queue.save()
}

export function handleResolved(event: ResolvedEvent): void {
  const container = loadOrCreateContainer(event.params.containerHash, event)
  const challenge = ChallengeEntity.load(
    event.params.containerHash.toHexString()
  )

  container.state = event.params.approved ? EXECUTED_STATUS : CANCELLED_STATUS
  challenge.approved = event.params.approved

  container.save()
  challenge.save()
}

export function handleVetoed(event: VetoedEvent): void {
  const queue = loadOrCreateQueue(event.address)

  const container = loadOrCreateContainer(event.params.containerHash, event)
  container.state = CANCELLED_STATUS
  const amountOfEvents = container.history.length
  const containerEvent = loadOrCreateContainerEvent(
    event.params.containerHash,
    amountOfEvents
  )
  const containerEventId = buildActionId(
    event.params.containerHash,
    amountOfEvents
  )
  containerEvent.type = VETO_CONTAINER_EVENT
  containerEvent.createdAt = event.block.timestamp
  containerEvent.data = [event.params.reason.toHexString()]

  const containerEvents = container.history
  containerEvents.push(containerEventId)
  container.history = containerEvents

  containerEvent.save()
  container.save()
  queue.save()
}

export function handleConfigured(event: ConfiguredEvent): void {
  const queue = loadOrCreateQueue(event.address)
  const config = loadOrCreateConfig(event.address)

  const scheduleDeposit = loadOrCreateCollateral(event, '1')
  scheduleDeposit.token = event.params.config.scheduleDeposit.token
  scheduleDeposit.amount = event.params.config.scheduleDeposit.amount

  const challengeDeposit = loadOrCreateCollateral(event, '2')
  challengeDeposit.token = event.params.config.challengeDeposit.token

  challengeDeposit.amount = event.params.config.challengeDeposit.amount

  const vetoDeposit = loadOrCreateCollateral(event, '3')
  vetoDeposit.token = event.params.config.vetoDeposit.token
  vetoDeposit.amount = event.params.config.vetoDeposit.amount

  config.executionDelay = event.params.config.executionDelay
  config.scheduleDeposit = scheduleDeposit.id
  config.challengeDeposit = challengeDeposit.id
  config.vetoDeposit = vetoDeposit.id
  config.resolver = event.params.config.resolver
  config.rules = event.params.config.rules

  queue.config = event.address.toHexString()

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

  const container = loadOrCreateContainer(containerHash, event)
  const challenge = ChallengeEntity.load(containerHash.toHexString())

  container.state =
    event.params.ruling === ALLOW_RULING ? APPROVED_STATUS : REJECTED_STATUS
  challenge.ruling = event.params.ruling

  container.save()
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
    queue.config = ''
    queue.queued = []
    queue.challenged = []
    queue.roles = []
  }
  return queue!
}

function loadOrCreateConfig(queue: Address): ConfigEntity {
  const configId = queue.toHexString()
  // Create config
  let config = ConfigEntity.load(configId)
  if (config === null) {
    config = new ConfigEntity(configId)
    config.queue = queue.toHexString()
  }
  return config!
}

function loadOrCreateContainer(
  containerHash: Bytes,
  event: ethereum.Event
): ContainerEntity {
  const ContainerId = containerHash.toHexString()
  // Create container
  let container = ContainerEntity.load(ContainerId)
  if (container === null) {
    container = new ContainerEntity(ContainerId)
    container.queue = event.address.toHexString()
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

function loadOrCreateContainerEvent(
  containerHash: Bytes,
  amountOfEvents: number
): ContainerEventEntity {
  const eventId = buildActionId(containerHash, amountOfEvents)
  let containerEvent = new ContainerEventEntity(eventId)
  if (containerEvent === null) {
    containerEvent = new ContainerEventEntity(eventId)
  }

  return containerEvent!
}

function buildActions(event: ScheduledEvent): void {
  const actions = event.params.payload.actions
  for (let index = 0; index < actions.length; index++) {
    const actionId = buildActionId(event.params.containerHash, index)
    const action = new ActionEntity(actionId)

    action.to = actions[index].to
    action.value = actions[index].value
    action.data = actions[index].data
    action.payload = event.params.containerHash.toHexString()

    action.save()
  }
}
