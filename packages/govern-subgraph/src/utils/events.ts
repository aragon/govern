import {
  Collateral as CollateralEntity,
  Container as ContainerEntity,
  ContainerEventChallenge,
  ContainerEventExecute,
  ContainerEventResolve,
  ContainerEventRule,
  ContainerEventSchedule,
  ContainerEventVeto,
} from '../../generated/schema'
import { Executed as ExecutedEvent } from '../../generated/templates/Govern/Govern'
import {
  Challenged as ChallengedEvent,
  Resolved as ResolvedEvent,
  Ruled as RuledEvent,
  Scheduled as ScheduledEvent,
  Vetoed as VetoedEvent,
} from '../../generated/templates/GovernQueue/GovernQueue'
import { buildId, buildEventHandlerId } from './ids'
import { Bytes } from '@graphprotocol/graph-ts'

function finalizeContainerEvent<T, U>(
  container: ContainerEntity,
  containerEvent: U,
  ethereumEvent: T
): U {
  containerEvent.createdAt = ethereumEvent.block.timestamp
  containerEvent.container = container.id

  container.save()
  containerEvent.save()

  return containerEvent
}

export function handleContainerEventChallenge(
  container: ContainerEntity,
  ethereumEvent: ChallengedEvent,
  resolver: Bytes
): ContainerEventChallenge {
  let eventId = buildEventHandlerId(
    container.id,
    'challenge',
    ethereumEvent.transactionLogIndex.toHexString()
  )

  let containerEvent = new ContainerEventChallenge(eventId)

  containerEvent.challenger = ethereumEvent.params.actor
  containerEvent.reason = ethereumEvent.params.reason
  containerEvent.disputeId = ethereumEvent.params.resolverId
  containerEvent.resolver = resolver

  let collateral = new CollateralEntity(buildId(ethereumEvent))
  collateral.token = ethereumEvent.params.collateral.token
  collateral.amount = ethereumEvent.params.collateral.amount
  collateral.save()

  containerEvent.collateral = collateral.id

  return finalizeContainerEvent<ChallengedEvent, ContainerEventChallenge>(
    container,
    containerEvent,
    ethereumEvent
  )
}

export function handleContainerEventExecute(
  container: ContainerEntity,
  ethereumEvent: ExecutedEvent
): ContainerEventExecute {
  let eventId = buildEventHandlerId(
    container.id,
    'execute',
    ethereumEvent.transactionLogIndex.toHexString()
  )

  let containerEvent = new ContainerEventExecute(eventId)
  containerEvent.execResults = ethereumEvent.params.execResults

  return finalizeContainerEvent<ExecutedEvent, ContainerEventExecute>(
    container,
    containerEvent,
    ethereumEvent
  )
}

export function handleContainerEventResolve(
  container: ContainerEntity,
  ethereumEvent: ResolvedEvent
): ContainerEventResolve {
  let eventId = buildEventHandlerId(
    container.id,
    'resolve',
    ethereumEvent.transactionLogIndex.toHexString()
  )

  let containerEvent = new ContainerEventResolve(eventId)
  containerEvent.approved = ethereumEvent.params.approved

  return finalizeContainerEvent<ResolvedEvent, ContainerEventResolve>(
    container,
    containerEvent,
    ethereumEvent
  )
}

export function handleContainerEventRule(
  container: ContainerEntity,
  ethereumEvent: RuledEvent
): ContainerEventRule {
  let eventId = buildEventHandlerId(
    container.id,
    'rule',
    ethereumEvent.transactionLogIndex.toHexString()
  )

  let containerEvent = new ContainerEventRule(eventId)
  containerEvent.ruling = ethereumEvent.params.ruling

  return finalizeContainerEvent<RuledEvent, ContainerEventRule>(
    container,
    containerEvent,
    ethereumEvent
  )
}

export function handleContainerEventSchedule(
  container: ContainerEntity,
  ethereumEvent: ScheduledEvent,
  scheduleDeposit: CollateralEntity
): ContainerEventSchedule {
  let eventId = buildEventHandlerId(
    container.id,
    'schedule',
    ethereumEvent.transactionLogIndex.toHexString()
  )

  let containerEvent = new ContainerEventSchedule(eventId)

  let collateral = new CollateralEntity(buildId(ethereumEvent))
  collateral.token = scheduleDeposit.token
  collateral.amount = scheduleDeposit.amount
  collateral.save()

  containerEvent.collateral = collateral.id

  return finalizeContainerEvent<ScheduledEvent, ContainerEventSchedule>(
    container,
    containerEvent,
    ethereumEvent
  )
}

export function handleContainerEventVeto(
  container: ContainerEntity,
  ethereumEvent: VetoedEvent
): ContainerEventVeto {
  let eventId = buildEventHandlerId(
    container.id,
    'veto',
    ethereumEvent.transactionLogIndex.toHexString()
  )

  let containerEvent = new ContainerEventVeto(eventId)
  containerEvent.reason = ethereumEvent.params.reason

  return finalizeContainerEvent<VetoedEvent, ContainerEventVeto>(
    container,
    containerEvent,
    ethereumEvent
  )
}
