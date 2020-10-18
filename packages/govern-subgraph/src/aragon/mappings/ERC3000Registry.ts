import { Registered as RegisteredEvent } from '../../../generated/ERC3000Registry/ERC3000Registry'

import { Govern, GovernQueue } from '../../../generated/schema'

import {
  Govern as GovernTemplate,
  GovernQueue as QueueTemplate
} from '../../../generated/templates'

export function handleRegistered(event: RegisteredEvent): void {
  const governId = event.params.dao.toHexString()
  const GovernQueueId = event.params.queue.toHexString()

  let govern = Govern.load(governId)
  let queue = GovernQueue.load(GovernQueueId)

  if (!govern) {
    govern = new Govern(governId)
    govern.address = event.params.dao
    govern.name = event.params.name
    govern.roles = []
  }
  if (!queue) {
    queue = new GovernQueue(GovernQueueId)
    queue.address = event.params.queue
    queue.containers = []
    queue.roles = []
  }

  queue.govern = govern.id

  govern.save()
  queue.save()

  GovernTemplate.create(event.params.dao)
  QueueTemplate.create(event.params.queue)
}
