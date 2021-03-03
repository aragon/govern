import { Address, Bytes } from '@graphprotocol/graph-ts'
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
  ALLOW_RULING
} from './utils/constants'
import {
  handleContainerEventChallenge,
  handleContainerEventResolve,
  handleContainerEventRule,
  handleContainerEventSchedule,
  handleContainerEventVeto
} from './utils/events'

export function handleScheduled(event: ScheduledEvent): void {
  let queue = loadOrCreateQueue(event.address)
  let payload = loadOrCreatePayload(event.params.containerHash)
  let container = loadOrCreateContainer(event.params.containerHash)
  // Builds each of the actions bundled in the payload,
  // and saves them to the DB.
  buildActions(event)
  payload.nonce = event.params.payload.nonce
  payload.executionTime = event.params.payload.executionTime
  payload.submitter = event.params.payload.submitter
  payload.executor = event.params.payload.executor.toHex()
  payload.allowFailuresMap = event.params.payload.allowFailuresMap
  payload.proof = event.params.payload.proof

  container.payload = payload.id
  container.state = SCHEDULED_STATUS
  // This should always be possible, as a queue without a config
  // should be impossible to get at this stage
  container.config = queue.config
  container.queue = queue.id
  let config = loadConfig(queue.config)
  let scheduleDeposit = loadCollateral(config.scheduleDeposit)

  handleContainerEventSchedule(container, event, scheduleDeposit as CollateralEntity)

  payload.save()
  container.save()
  queue.save()
}

export function handleExecuted(event: ExecutedEvent): void {
  let container = loadOrCreateContainer(event.params.containerHash)
  container.state = EXECUTED_STATUS
  container.save()
}

export function handleChallenged(event: ChallengedEvent): void {
  let queue = loadOrCreateQueue(event.address)
  let container = loadOrCreateContainer(event.params.containerHash)

  container.state = CHALLENGED_STATUS

  let resolver = ConfigEntity.load(queue.config).resolver
  let containerEvent = handleContainerEventChallenge(container, event, resolver)

  containerEvent.save()
  container.save()
  queue.save()
}

export function handleResolved(event: ResolvedEvent): void {
  let container = loadOrCreateContainer(event.params.containerHash)

  container.state = event.params.approved ? APPROVED_STATUS : REJECTED_STATUS

  handleContainerEventResolve(container, event)

  container.save()
}

export function handleVetoed(event: VetoedEvent): void {
  let queue = loadOrCreateQueue(event.address)
  let container = loadOrCreateContainer(event.params.containerHash)

  container.state = CANCELLED_STATUS

  handleContainerEventVeto(container, event)

  container.save()
  queue.save()
}

export function handleConfigured(event: ConfiguredEvent): void {
  let queue = loadOrCreateQueue(event.address)

  let configId = buildId(event)
  let config = new ConfigEntity(configId)

  let scheduleDeposit = new CollateralEntity(
    buildIndexedId(event.transaction.hash.toHex(), 1)
  )
  scheduleDeposit.token = event.params.config.scheduleDeposit.token
  scheduleDeposit.amount = event.params.config.scheduleDeposit.amount

  let challengeDeposit = new CollateralEntity(
    buildIndexedId(event.transaction.hash.toHex(), 2)
  )
  challengeDeposit.token = event.params.config.challengeDeposit.token
  challengeDeposit.amount = event.params.config.challengeDeposit.amount

  config.queue = queue.id
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

// MiniACL Events

export function handleFrozen(event: FrozenEvent): void {
  let queue = loadOrCreateQueue(event.address)

  let roles = queue.roles!

  frozenRoles(roles, event.params.role)
}

export function handleGranted(event: GrantedEvent): void {
  let queue = loadOrCreateQueue(event.address)

  let role = roleGranted(event.address, event.params.role, event.params.who)

  // add the role
  let currentRoles = queue.roles
  currentRoles.push(role.id)
  queue.roles = currentRoles

  queue.save()
}

export function handleRevoked(event: RevokedEvent): void {
  let queue = loadOrCreateQueue(event.address)

  let role = roleRevoked(event.address, event.params.role, event.params.who)

  // add the role
  let currentRoles = queue.roles
  currentRoles.push(role.id)
  queue.roles = currentRoles

  queue.save()
}

// Helpers

export function loadOrCreateQueue(entity: Address): GovernQueueEntity {
  let queueId = entity.toHex()
  // Create queue
  let queue = GovernQueueEntity.load(queueId)
  if (queue === null) {
    queue = new GovernQueueEntity(queueId)
    queue.address = entity
    queue.config = ''
    queue.roles = []
  }
  return queue!
}

export function loadOrCreateContainer(containerHash: Bytes): ContainerEntity {
  let ContainerId = containerHash.toHex()
  // Create container
  let container = ContainerEntity.load(ContainerId)
  if (container === null) {
    container = new ContainerEntity(ContainerId)
    container.state = NONE_STATUS
  }
  return container!
}

function loadOrCreatePayload(containerHash: Bytes): PayloadEntity {
  let PayloadId = containerHash.toHex()
  // Create payload
  let payload = PayloadEntity.load(PayloadId)
  if (payload === null) {
    payload = new PayloadEntity(PayloadId)
  }
  return payload!
}

function loadConfig(configAddress: string): ConfigEntity {
  let config = ConfigEntity.load(configAddress)
  if (config === null) {
    throw new Error('Config not found.')
  }
  return config!
}

function loadCollateral(collateralAddress: string): CollateralEntity {
  let collateral = CollateralEntity.load(collateralAddress)
  if (collateral === null) {
    throw new Error('Collateral not found.')
  }
  return collateral!
}

function buildActions(event: ScheduledEvent): void {
  let actions = event.params.payload.actions
  for (let index = 0; index < actions.length; index++) {
    let actionId = buildIndexedId(event.params.containerHash.toHex(), index)
    let action = new ActionEntity(actionId)

    action.to = actions[index].to
    action.value = actions[index].value
    action.data = actions[index].data
    action.payload = event.params.containerHash.toHex()

    action.save()
  }
}

