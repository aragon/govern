import { Address } from '@graphprotocol/graph-ts'
import {
  Registered as RegisteredEvent,
  SetMetadata as SetMetadataEvent,
} from '../generated/GovernRegistry/GovernRegistry'
import {
  Govern as GovernTemplate,
  GovernQueue as GovernQueueTemplate,
} from '../generated/templates'
import { GovernRegistry, Dao } from '../generated/schema'
import { loadOrCreateGovern } from './Govern'
import { loadOrCreateQueue } from './GovernQueue'

export function handleRegistered(event: RegisteredEvent): void {
  let registry = loadOrCreateRegistry(event.address)

  let queue = loadOrCreateQueue(event.params.queue)
  let govern = loadOrCreateGovern(event.params.executor)

  queue.save()
  govern.save()
  let dao = new Dao(event.params.name)

  dao.name = event.params.name
  dao.executor = event.params.executor.toHex()
  dao.queue = event.params.queue.toHex()
  dao.token = event.params.token.toHex()
  dao.minter = event.params.minter.toHex()
  dao.registrant = event.params.registrant.toHex()
  dao.createdAt = event.block.timestamp

  // add dao to the registry
  let currentDAOs = registry.daos
  currentDAOs.push(dao.id)
  registry.daos = currentDAOs

  registry.count += 1

  dao.save()
  registry.save()

  // Create datasource templates
  GovernTemplate.create(event.params.executor)
  GovernQueueTemplate.create(event.params.queue)
}

export function handleSetMetadata(event: SetMetadataEvent): void {
  let govern = loadOrCreateGovern(event.params.executor)
  govern.metadata = event.params.metadata

  govern.save()
}

export function loadOrCreateRegistry(registryAddress: Address): GovernRegistry {
  let registryId = registryAddress.toHex()
  let registry = GovernRegistry.load(registryId)

  if (registry === null) {
    registry = new GovernRegistry(registryId)
    registry.address = registryAddress
    registry.count = 0
    registry.daos = []
  }
  return registry!
}
