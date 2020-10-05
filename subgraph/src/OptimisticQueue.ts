import {
  Challenged as ChallengedEvent,
  Configured as ConfiguredEvent,
  Executed as ExecutedEvent,
  Resolved as ResolvedEvent,
  Scheduled as ScheduledEvent,
  Vetoed as VetoedEvent,
} from '../generated/templates/OptimisticQueue/OptimisticQueue'
import {
  Action,
  Config,
  Container,
  Collateral,
  OptimisticQueue,
  Payload,
} from '../generated/schema'

const APPROVED_TYPE = "Approved"
const CANCELLED_TYPE = "Cancelled"
const CHALLENGED_TYPE = "Challenged"
const EXECUTED_TYPE = "Executed"
const SCHEDULED_TYPE = "Scheduled"
const VETOED_TYPE = "Vetoed"

export function handleChallenged(event: ChallengedEvent): void {
  const container = Container.load(event.params.containerHash.toHexString())
  container.executionState = CHALLENGED_TYPE
  container.save()
}

export function handleConfigured(event: ConfiguredEvent): void {
  let queue = OptimisticQueue.load(event.address.toHexString())
  // TODO: Can there be no queue? check event processing order
  const config = new Config(event.address.toHexString())

  const scheduleCollateral = new Collateral(
    event.transaction.hash.toHexString() + '1'
  )
  scheduleCollateral.token = event.params.config.scheduleDeposit.token
  scheduleCollateral.amount = event.params.config.scheduleDeposit.amount

  const challengeCollateral = new Collateral(
    event.transaction.hash.toHexString() + '2'
  )
  challengeCollateral.token = event.params.config.challengeDeposit.token
  challengeCollateral.amount = event.params.config.challengeDeposit.amount

  const vetoCollateral = new Collateral(
    event.transaction.hash.toHexString() + '3'
  )
  vetoCollateral.token = event.params.config.vetoDeposit.token
  vetoCollateral.amount = event.params.config.vetoDeposit.amount

  config.executionDelay = event.params.config.executionDelay
  config.scheduleDeposit = scheduleCollateral.id
  config.challengeDeposit = challengeCollateral.id
  config.vetoDeposit = vetoCollateral.id
  config.resolver = event.params.config.resolver
  config.rules = event.params.config.rules

  queue.config = config.id

  queue.save()
  config.save()
  scheduleCollateral.save()
  challengeCollateral.save()
  vetoCollateral.save()
}

export function handleExecuted(event: ExecutedEvent): void {
  const container = Container.load(event.params.containerHash.toHexString())
  container.executionState = EXECUTED_TYPE
  container.save()
}

export function handleResolved(event: ResolvedEvent): void {
  const container = Container.load(event.params.containerHash.toHexString())
  const approved = event.params.approved
  container.executionState = approved ? APPROVED_TYPE : CANCELLED_TYPE
  container.save()
}

export function handleScheduled(event: ScheduledEvent): void {
  let queue = OptimisticQueue.load(event.address.toHexString())
  if (!queue) {
    throw new Error('Didnt find queue')
  }
  const containerId = event.params.containerHash.toHexString()
  const payloadId = `${containerId}-payload`
  const container = new Container(containerId)
  const payload = new Payload(payloadId)

  payload.nonce = event.params.payload.nonce
  payload.submitter = event.params.payload.submitter
  payload.executor = event.params.payload.executor.toHexString()
  payload.proof = event.params.payload.proof
  payload.actions = []

  // This loop is probably going to be slow as hell, but there's not much to do here
  const actions = event.params.payload.actions
  for(let id = 0; id < actions.length; id++) {
    const action = actions[id]
    const queuedActionId = `${containerId}-action-${id}`
    const queuedAction = new Action(queuedActionId)
    queuedAction.to = action.to
    queuedAction.value = action.value
    queuedAction.data = action.data
    queuedAction.save()
    payload.actions.push(queuedActionId)
  }

  container.payload = payloadId
  container.config = event.address.toHexString()
  container.executionState = SCHEDULED_TYPE
  queue.containers.push(containerId)

  payload.save()
  container.save()
}

export function handleVetoed(event: VetoedEvent): void {
  const container = Container.load(event.params.containerHash.toHexString())
  container.executionState = VETOED_TYPE
  container.vetoReason = event.params.reason
  container.save()
}
