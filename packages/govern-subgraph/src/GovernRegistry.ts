import { Address } from '@graphprotocol/graph-ts'
import {
  Registered as RegisteredEvent,
  SetMetadata as SetMetadataEvent
} from '../generated/GovernRegistry/GovernRegistry'
import {
  Govern as GovernTemplate,
  GovernQueue as GovernQueueTemplate
} from '../generated/templates'
import {
  GovernRegistry as GovernRegistryEntity,
  RegistryEntry as RegistryEntryEntity
} from '../generated/schema'
import { loadOrCreateGovern } from './Govern'

export function handleRegistered(event: RegisteredEvent): void {
  let registry = loadOrCreateRegistry(event.address)

  let registryEntry = new RegistryEntryEntity(event.params.name)

  registryEntry.name = event.params.name
  registryEntry.executor = event.params.executor.toHex()
  registryEntry.queue = event.params.queue.toHex()

  // add game to the registry
  let currentEntries = registry.entries
  currentEntries.push(registryEntry.id)
  registry.entries = currentEntries

  registry.count += 1

  registryEntry.save()
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

export function loadOrCreateRegistry(
  registryAddress: Address
): GovernRegistryEntity {
  let registryId = registryAddress.toHex()
  let registry = GovernRegistryEntity.load(registryId)

  if (registry === null) {
    registry = new GovernRegistryEntity(registryId)
    registry.address = registryAddress
    registry.count = 0
    registry.entries = []
  }
  return registry!
}
