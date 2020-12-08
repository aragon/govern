import {
  Collateral as CollateralEntity,
  Container as ContainerEntity,
  ContainerEventChallenge as ContainerEventChallengeEntity,
  ContainerEventExecute as ContainerEventExecuteEntity,
  ContainerEventResolve as ContainerEventResolveEntity,
  ContainerEventRule as ContainerEventRuleEntity,
  ContainerEventSchedule as ContainerEventScheduleEntity,
  ContainerEventSubmitEvidence as ContainerEventSubmitEvidenceEntity,
  ContainerEventVeto as ContainerEventVetoEntity
} from '../../generated/schema'
import { Executed as ExecutedEvent } from '../../generated/templates/Govern/Govern'
import {
  Challenged as ChallengedEvent,
  Resolved as ResolvedEvent,
  Ruled as RuledEvent,
  Scheduled as ScheduledEvent,
  EvidenceSubmitted as EvidenceSubmittedEvent,
  Vetoed as VetoedEvent
} from '../../generated/templates/GovernQueue/GovernQueue'
import { buildId, buildIndexedId, buildEventHandlerId } from './ids'

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
  ethereumEvent: ChallengedEvent
): ContainerEventChallengeEntity {
  let eventId = buildEventHandlerId(container.id, 'challenge', ethereumEvent.transactionLogIndex.toHexString())

  let containerEvent = new ContainerEventChallengeEntity(eventId)

  containerEvent.actor = ethereumEvent.params.actor
  containerEvent.reason = ethereumEvent.params.reason
  containerEvent.disputeId = ethereumEvent.params.resolverId

  let collateral = new CollateralEntity(buildId(ethereumEvent))
  collateral.token = ethereumEvent.params.collateral.token
  collateral.amount = ethereumEvent.params.collateral.amount
  collateral.save()

  containerEvent.collateral = collateral.id

  return finalizeContainerEvent<ChallengedEvent, ContainerEventChallengeEntity>(
    container,
    containerEvent,
    ethereumEvent
  )
}

export function handleContainerEventExecute(
  container: ContainerEntity,
  ethereumEvent: ExecutedEvent
): ContainerEventExecuteEntity {
  let eventId = buildEventHandlerId(container.id, 'execute', ethereumEvent.transactionLogIndex.toHexString())

  let containerEvent = new ContainerEventExecuteEntity(eventId)
  containerEvent.execResults = ethereumEvent.params.execResults

  return finalizeContainerEvent<ExecutedEvent, ContainerEventExecuteEntity>(
    container,
    containerEvent,
    ethereumEvent
  )
}

export function handleContainerEventResolve(
  container: ContainerEntity,
  ethereumEvent: ResolvedEvent
): ContainerEventResolveEntity {
  let eventId = buildEventHandlerId(container.id, 'resolve', ethereumEvent.transactionLogIndex.toHexString())

  let containerEvent = new ContainerEventResolveEntity(eventId)
  containerEvent.approved = ethereumEvent.params.approved

  return finalizeContainerEvent<ResolvedEvent, ContainerEventResolveEntity>(
    container,
    containerEvent,
    ethereumEvent
  )
}

export function handleContainerEventRule(
  container: ContainerEntity,
  ethereumEvent: RuledEvent
): ContainerEventRuleEntity {
  let eventId = buildEventHandlerId(container.id, 'rule', ethereumEvent.transactionLogIndex.toHexString())

  let containerEvent = new ContainerEventRuleEntity(eventId)
  containerEvent.ruling = ethereumEvent.params.ruling

  return finalizeContainerEvent<RuledEvent, ContainerEventRuleEntity>(
    container,
    containerEvent,
    ethereumEvent
  )
}

export function handleContainerEventSchedule(
  container: ContainerEntity,
  ethereumEvent: ScheduledEvent,
  scheduleDeposit: CollateralEntity
): ContainerEventScheduleEntity {
  let eventId = buildEventHandlerId(container.id, 'schedule', ethereumEvent.transactionLogIndex.toHexString())

  let containerEvent = new ContainerEventScheduleEntity(eventId)

  let collateral = new CollateralEntity(buildId(ethereumEvent))
  collateral.token = scheduleDeposit.token
  collateral.amount = scheduleDeposit.amount
  collateral.save()

  containerEvent.collateral = collateral.id

  return finalizeContainerEvent<ScheduledEvent, ContainerEventScheduleEntity>(
    container,
    containerEvent,
    ethereumEvent
  )
}

export function handleContainerEventSubmitEvidence(
  container: ContainerEntity,
  ethereumEvent: EvidenceSubmittedEvent
): ContainerEventSubmitEvidenceEntity {
  let eventId = buildEventHandlerId(container.id, 'submitEvidence', ethereumEvent.transactionLogIndex.toHexString())

  let containerEvent = new ContainerEventSubmitEvidenceEntity(eventId)
  containerEvent.evidence = ethereumEvent.params.evidence
  containerEvent.submitter = ethereumEvent.params.submitter
  containerEvent.finished = ethereumEvent.params.finished

  return finalizeContainerEvent<
    EvidenceSubmittedEvent,
    ContainerEventSubmitEvidenceEntity
  >(container, containerEvent, ethereumEvent)
}

export function handleContainerEventVeto(
  container: ContainerEntity,
  ethereumEvent: VetoedEvent
): ContainerEventVetoEntity {
  let eventId = buildEventHandlerId(container.id, 'veto', ethereumEvent.transactionLogIndex.toHexString())

  let containerEvent = new ContainerEventVetoEntity(eventId)
  containerEvent.reason = ethereumEvent.params.reason

  return finalizeContainerEvent<VetoedEvent, ContainerEventVetoEntity>(
    container,
    containerEvent,
    ethereumEvent
  )
}
