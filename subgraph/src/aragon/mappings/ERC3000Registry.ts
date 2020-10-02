import { Registered as RegisteredEvent } from '../../../generated/ERC3000Registry/ERC3000Registry'

import {
  Eaglet,
  OptimisticQueue,
} from '../../../generated/schema'

import {
  Eaglet as EagletTemplate,
  OptimisticQueue as QueueTemplate,
} from '../../../generated/templates'

export function handleRegistered(event: RegisteredEvent): void {
  const eagletId = event.params.dao.toHexString()
  const optimisticQueueId = event.params.queue.toHexString()

  let eaglet = Eaglet.load(eagletId)
  let queue = OptimisticQueue.load(optimisticQueueId)

  if (!eaglet) {
    eaglet = new Eaglet(eagletId)
    eaglet.address = event.params.dao
  }
  if (!queue) {
    queue = new OptimisticQueue(optimisticQueueId)
    queue.address = event.params.queue
    queue.containers = []
  }

  queue.eaglet = eaglet.id

  eaglet.save()
  queue.save()

  EagletTemplate.create(event.params.dao)
  QueueTemplate.create(event.params.queue)
}

