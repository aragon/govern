import {
  Address,
  Bytes,
  BigInt,
  ipfs,
  json,
  log
} from '@graphprotocol/graph-ts'
import {
  Challenged as ChallengedEvent,
  Configured as ConfiguredEvent,
  Executed as ExecutedEvent,
  Frozen as FrozenEvent,
  Granted as GrantedEvent,
  Resolved as ResolvedEvent,
  Revoked as RevokedEvent,
  Scheduled as ScheduledEvent,
  Vetoed as VetoedEvent
} from '../generated/templates/GovernQueue/GovernQueue'

import { GovernQueue as GovernQueueContract } from '../generated/templates/GovernQueue/GovernQueue'
import { getERC20Info } from './utils/tokens'

import {
  Action,
  Collateral,
  Config,
  Container,
  Payload,
  GovernQueue
} from '../generated/schema'
import { frozenRoles, roleGranted, roleRevoked } from './lib/MiniACL'
import { buildId, buildIndexedId } from './utils/ids'
import {
  ZERO_ADDRESS,
  APPROVED_STATUS,
  VETOED_STATUS,
  CHALLENGED_STATUS,
  EXECUTED_STATUS,
  NONE_STATUS,
  REJECTED_STATUS,
  SCHEDULED_STATUS
} from './utils/constants'
import {
  handleContainerEventChallenge,
  handleContainerEventResolve,
  handleContainerEventSchedule,
  handleContainerEventVeto
} from './utils/events'

import { loadOrCreateGovern } from './Govern'

export function handleScheduled(event: ScheduledEvent): void {
  let queue = loadOrCreateQueue(event.address)
  let payload = loadOrCreatePayload(event.params.containerHash)
  let container = loadOrCreateContainer(event.params.containerHash)
  let executor = loadOrCreateGovern(event.params.payload.executor)

  // Builds each of the actions bundled in the payload,
  // and saves them to the DB.
  buildActions(event)

  payload.nonce = event.params.payload.nonce
  payload.executionTime = event.params.payload.executionTime
  payload.submitter = event.params.payload.submitter
  payload.executor = executor.id
  payload.allowFailuresMap = event.params.payload.allowFailuresMap
  payload.proof = event.params.payload.proof

  let proofIpfsHex = event.params.payload.proof.toHexString().substring(2)

  // if cidString is ipfs v1 version hex from the cid's raw bytes and
  // we add `f` as a multibase prefix and remove `0x`
  let result = ipfs.cat('f' + proofIpfsHex + '/metadata.json')
  if (!result) {
    // if cidString is ipfs v0 version hex from the cid's raw bytes,
    // we add:
    // 1. 112 (0x70 in hex) which is dag-pb format.
    // 2. 01 because we want to use v1 version
    // 3. f since cidString is already hex, we only add `f` without converting anything.
    result = ipfs.cat('f0170' + proofIpfsHex + '/metadata.json')
  }

  if (result) {
    // log.debug('title {}', [result.toHex()])
    // let data = json.fromBytes(result as Bytes)
    // payload.title = data.toObject().get('title').toString()
    payload.title = result.toHex()
  }

  container.payload = payload.id
  container.state = SCHEDULED_STATUS
  container.createdAt = event.block.timestamp
  // This should always be possible, as a queue without a config
  // should be impossible to get at this stage
  container.config = queue.config
  container.queue = queue.id
  let config = loadConfig(queue.config)
  let scheduleDeposit = loadCollateral(config.scheduleDeposit)

  handleContainerEventSchedule(container, event, scheduleDeposit as Collateral)

  executor.save()
  payload.save()
  container.save()
  queue.save()
}

export function handleExecuted(event: ExecutedEvent): void {
  log.debug('executed event params {}', [event.params.containerHash.toString()])
  let container = loadOrCreateContainer(event.params.containerHash)
  container.state = EXECUTED_STATUS
  container.save()
}

export function handleChallenged(event: ChallengedEvent): void {
  let queue = loadOrCreateQueue(event.address)
  let container = loadOrCreateContainer(event.params.containerHash)

  container.state = CHALLENGED_STATUS

  let resolver = Config.load(queue.config).resolver
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

  container.state = VETOED_STATUS

  handleContainerEventVeto(container, event)

  container.save()
  queue.save()
}

export function handleConfigured(event: ConfiguredEvent): void {
  let queue = loadOrCreateQueue(event.address)

  let configId = buildId(event)
  let config = new Config(configId)

  let scheduleDeposit = new Collateral(
    buildIndexedId(event.transaction.hash.toHex(), 1)
  )
  scheduleDeposit.token = event.params.config.scheduleDeposit.token
  scheduleDeposit.amount = event.params.config.scheduleDeposit.amount

  let challengeDeposit = new Collateral(
    buildIndexedId(event.transaction.hash.toHex(), 2)
  )
  challengeDeposit.token = event.params.config.challengeDeposit.token
  challengeDeposit.amount = event.params.config.challengeDeposit.amount

  // Grab Schedule Token info
  let data = getERC20Info(event.params.config.scheduleDeposit.token)
  scheduleDeposit.decimals = data.decimals
  scheduleDeposit.name = data.name
  scheduleDeposit.symbol = data.symbol

  // Grab challenge Token info
  data = getERC20Info(event.params.config.challengeDeposit.token)
  challengeDeposit.decimals = data.decimals
  challengeDeposit.name = data.name
  challengeDeposit.symbol = data.symbol

  config.executionDelay = event.params.config.executionDelay
  config.scheduleDeposit = scheduleDeposit.id
  config.challengeDeposit = challengeDeposit.id
  config.resolver = event.params.config.resolver
  config.rules = event.params.config.rules
  config.maxCalldataSize = event.params.config.maxCalldataSize

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

// create a dummy config when creating queue to avoid not-null error
export function createDummyConfig(queueId: string): string {
  let ZERO = BigInt.fromI32(0)

  let configId = queueId
  let config = new Config(configId)

  let scheduleDeposit = new Collateral(buildIndexedId(configId, 1))
  scheduleDeposit.token = ZERO_ADDRESS
  scheduleDeposit.amount = ZERO

  let challengeDeposit = new Collateral(buildIndexedId(configId, 2))
  challengeDeposit.token = ZERO_ADDRESS
  challengeDeposit.amount = ZERO

  config.executionDelay = ZERO
  config.scheduleDeposit = scheduleDeposit.id
  config.challengeDeposit = challengeDeposit.id
  config.resolver = ZERO_ADDRESS
  config.rules = Bytes.fromI32(0) as Bytes
  config.maxCalldataSize = BigInt.fromI32(0)
  scheduleDeposit.save()
  challengeDeposit.save()
  config.save()

  return config.id!
}

export function loadOrCreateQueue(queueAddress: Address): GovernQueue {
  let queueId = queueAddress.toHex()
  // Create queue
  let queue = GovernQueue.load(queueId)
  if (queue === null) {
    queue = new GovernQueue(queueId)
    queue.address = queueAddress
    queue.config = createDummyConfig(queueId)
    queue.roles = []
  }

  queue.nonce = GovernQueueContract.bind(queueAddress).nonce()

  return queue!
}

export function loadOrCreateContainer(containerHash: Bytes): Container {
  let ContainerId = containerHash.toHex()
  // Create container
  let container = Container.load(ContainerId)

  if (container === null) {
    log.debug('container is null, createing new container with id ', [
      ContainerId
    ])
    container = new Container(ContainerId)
    container.state = NONE_STATUS
  } else {
    log.debug('container is NOT null for id {}', [ContainerId])
    if (container.queue === null) {
      log.debug('container queue is null, setting a zero address', [])
      container.queue = '0x0000000000000000000000000000000000000000'
    }
  }
  return container!
}

function loadOrCreatePayload(containerHash: Bytes): Payload {
  let PayloadId = containerHash.toHex()
  // Create payload
  let payload = Payload.load(PayloadId)
  if (payload === null) {
    payload = new Payload(PayloadId)
  }
  return payload!
}

function loadConfig(configAddress: string): Config {
  let config = Config.load(configAddress)
  if (config === null) {
    throw new Error('Config not found.')
  }
  return config!
}

function loadCollateral(collateralAddress: string): Collateral {
  let collateral = Collateral.load(collateralAddress)
  if (collateral === null) {
    throw new Error('Collateral not found.')
  }
  return collateral!
}

function buildActions(event: ScheduledEvent): void {
  let actions = event.params.payload.actions
  for (let index = 0; index < actions.length; index++) {
    let actionId = buildIndexedId(event.params.containerHash.toHex(), index)
    let action = new Action(actionId)

    action.to = actions[index].to
    action.value = actions[index].value
    action.data = actions[index].data
    action.payload = event.params.containerHash.toHex()

    action.save()
  }
}
