import { Address } from "@graphprotocol/graph-ts";
import {
  Registered as RegisteredEvent,
  SetMetadata as SetMetadataEvent,
} from "../generated/ERC3000Registry/ERC3000Registry";
import {
  Govern as GovernTemplate,
  OptimisticQueue as QueueTemplate,
} from "../generated/templates";
import {
  ERC3000Registry as ERC3000RegistryEntity,
  Entry as EntryEntity
} from "../generated/schema";

export function handleRegistered(event: RegisteredEvent): void {
  const registry = loadOrCreateRegistry(event.address)

  const entry = new EntryEntity(event.params.name)

  entry.name = event.params.name
  entry.dao = event.params.dao.toHexString()
  entry.queue = event.params.queue.toHexString()

  // add entry to the registry
  const currentEntries = registry.entries
  currentEntries.push(entry.id)
  registry.entries = currentEntries

  entry.save()
  registry.save()

  // Create datasource templates
  GovernTemplate.create(event.params.dao);
  QueueTemplate.create(event.params.queue);
}

export function handleSetMetadata(event: SetMetadataEvent): void {
  // TODO:
}


export function loadOrCreateRegistry(
  registryAddress: Address
): ERC3000RegistryEntity {
  const registryId = registryAddress.toHexString()
  let registry = ERC3000RegistryEntity.load(registryId)
  if (registry === null) {
    registry = new ERC3000RegistryEntity(registryId)
    registry.address = registryAddress
    registry.count = 0
    registry.entries = []
  }
  return registry!
}