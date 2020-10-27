import { BigInt } from '@graphprotocol/graph-ts'
import {
  Container as ContainerEntity,
  ContainerEvent as ContainerEventEntity
} from '../../generated/schema'
import { buildIndexedId } from './ids'

export function handleContainerEvent(
  container: ContainerEntity,
  timestamp: BigInt,
  eventType: string,
  data: string[]
): void {
  const containerEvent = loadOrCreateContainerEvent(
    container.id,
    container.history.length
  )

  containerEvent.type = eventType
  containerEvent.data = data
  containerEvent.createdAt = timestamp

  // add the event to the container
  const currentEvents = container.history
  currentEvents.push(containerEvent.id)
  container.history = currentEvents

  containerEvent.save()
}

function loadOrCreateContainerEvent(
  containerHash: string,
  amountOfEvents: number
): ContainerEventEntity {
  const eventId = buildIndexedId(containerHash, amountOfEvents)
  let containerEvent = new ContainerEventEntity(eventId)
  if (containerEvent === null) {
    containerEvent = new ContainerEventEntity(eventId)
  }

  return containerEvent!
}
