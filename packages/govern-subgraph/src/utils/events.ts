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
import { buildId, buildIndexedId } from './ids'

function finalizeContainerEvent<T, U>(
  container: ContainerEntity,
  containerEvent: U,
  ethereumEvent: T
): U {
  containerEvent.createdAt = ethereumEvent.block.timestamp
  container.history.push(containerEvent.id)
  container.save()
  containerEvent.save()

  return containerEvent
}

export function handleContainerEventChallenge(
  container: ContainerEntity,
  ethereumEvent: ChallengedEvent
): ContainerEventChallengeEntity {
  let eventId = buildIndexedId(container.id, container.history.length)

  let containerEvent = new ContainerEventChallengeEntity(eventId)

  containerEvent.actor = ethereumEvent.params.actor
  containerEvent.reason = ethereumEvent.params.reason
  containerEvent.resolverId = ethereumEvent.params.resolverId

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
  let eventId = buildIndexedId(container.id, container.history.length)

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
  let eventId = buildIndexedId(container.id, container.history.length)

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
  let eventId = buildIndexedId(container.id, container.history.length)

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
  ethereumEvent: ScheduledEvent
): ContainerEventScheduleEntity {
  let eventId = buildIndexedId(container.id, container.history.length)

  let containerEvent = new ContainerEventScheduleEntity(eventId)

  let collateral = new CollateralEntity(buildId(ethereumEvent))
  collateral.token = ethereumEvent.params.collateral.token
  collateral.amount = ethereumEvent.params.collateral.amount
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
  let eventId = buildIndexedId(container.id, container.history.length)

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
  let eventId = buildIndexedId(container.id, container.history.length)

  let containerEvent = new ContainerEventVetoEntity(eventId)
  containerEvent.reason = ethereumEvent.params.reason

  return finalizeContainerEvent<VetoedEvent, ContainerEventVetoEntity>(
    container,
    containerEvent,
    ethereumEvent
  )
}
