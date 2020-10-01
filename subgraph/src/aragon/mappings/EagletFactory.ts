import { NewEaglet as NewEagletEvent } from '../../../generated/EagletFactory/EagletFactory'

import {
  EagletFactory,
  Eaglet,
  OptimisticQueue,
} from '../../../generated/schema'

import {
  Eaglet as EagletTemplate,
  OptimisticQueue as QueueTemplate,
} from '../../../generated/templates'

export function handleNewEaglet(event: NewEagletEvent): void {
  // This looks a bit weird, but we're not expecting multiple factories,
  // but rather 1 trusted deployment.
  let factory = EagletFactory.load('1')
  const factoryAddress = event.address

  // if no factory yet, set up empty
  if (factory == null) {
    factory = new EagletFactory('1')
    factory.address = factoryAddress
    factory.eagletCount = 0
    factory.queueCount = 0
    factory.eaglets = []
    factory.queues = []
  }
  factory.eagletCount = factory.eagletCount + 1
  factory.queueCount = factory.queueCount + 1
  const eagletId = event.params.eaglet.toHexString()
  const eagletAddress = event.params.eaglet
  const optimisticQueueId = event.params.queue.toHexString()
  const optimisticQueueAddress = event.params.queue
  // Create eaglet and optimistic queue associated with this event
  const eaglet = new Eaglet(eagletId)
  eaglet.address = eagletAddress
  const queue = new OptimisticQueue(optimisticQueueId)
  queue.address = optimisticQueueAddress

  // register the eaglets and queues to the EagletFactory
  const currentEaglets = factory.eaglets
  const currentQueues = factory.queues
  currentEaglets.push(eaglet.id)
  currentQueues.push(queue.id)
  factory.eaglets = currentEaglets
  factory.queues = currentQueues
  // save to the store
  factory.save()
  eaglet.save()
  queue.save()

  EagletTemplate.create(eagletAddress)
  QueueTemplate.create(optimisticQueueAddress)
}
