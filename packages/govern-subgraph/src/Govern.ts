import { Address } from '@graphprotocol/graph-ts'
import {
  Executed as ExecutedEvent,
  Frozen as FrozenEvent,
  Granted as GrantedEvent,
  Revoked as RevokedEvent
} from '../generated/templates/Govern/Govern'
import {
  ContainerEventExecute as ContainerEventExecuteEntity,
  Govern as GovernEntity
} from '../generated/schema'
import { frozenRoles, roleGranted, roleRevoked } from './lib/MiniACL'
import { loadOrCreateContainer } from './GovernQueue'
import { handleContainerEventExecute } from './utils/events'

export function handleExecuted(event: ExecutedEvent): void {
  let govern = loadOrCreateGovern(event.address)
  let container = loadOrCreateContainer(event.params.memo)

  handleContainerEventExecute(container, event)

  let currentContainers = govern.containers
  currentContainers.push(container.id)
  govern.containers = currentContainers

  govern.save()
}

// MiniACL Events

export function handleFrozen(event: FrozenEvent): void {
  let govern = loadOrCreateGovern(event.address)

  let roles = govern.roles!

  frozenRoles(roles, event.params.role)
}

export function handleGranted(event: GrantedEvent): void {
  let govern = loadOrCreateGovern(event.address)

  // contemplar el caso en que se crea un nueva cola

  let role = roleGranted(event.address, event.params.role, event.params.who)

  // add the role
  let currentRoles = govern.roles
  currentRoles.push(role.id)
  govern.roles = currentRoles

  govern.save()
}

export function handleRevoked(event: RevokedEvent): void {
  let govern = loadOrCreateGovern(event.address)

  let role = roleRevoked(event.address, event.params.role, event.params.who)

  // add the role
  let currentRoles = govern.roles
  currentRoles.push(role.id)
  govern.roles = currentRoles

  govern.save()
}

// Helpers

export function loadOrCreateGovern(entity: Address): GovernEntity {
  let governId = entity.toHex()
  // Create govern
  let govern = GovernEntity.load(governId)
  if (govern === null) {
    govern = new GovernEntity(governId)
    govern.address = entity
    govern.roles = []
    govern.containers = []
  }
  return govern!
}
