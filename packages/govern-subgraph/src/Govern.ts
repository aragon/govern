import { Address } from '@graphprotocol/graph-ts'
import {
  Executed as ExecutedEvent,
  Frozen as FrozenEvent,
  Granted as GrantedEvent,
  Revoked as RevokedEvent
} from '../generated/templates/Govern/Govern'
import {
  Govern as GovernEntity,
} from '../generated/schema'
import { frozenRoles, roleGranted, roleRevoked } from './lib/MiniACL'

export function handleExecuted(event: ExecutedEvent): void {
  const govern = loadOrCreateGovern(event.address)

  const currentContainers = govern.containers

  currentContainers.push(event.params.memo.toHexString())
  govern.containers = currentContainers

  govern.save()
}

// MiniACL Events

export function handleFrozen(event: FrozenEvent): void {
  const govern = loadOrCreateGovern(event.address)

  const roles = govern.roles!

  frozenRoles(roles, event.params.role)
}

export function handleGranted(event: GrantedEvent): void {
  const govern = loadOrCreateGovern(event.address)

  // contemplar el caso en que se crea un nueva cola

  const role = roleGranted(event.address, event.params.role, event.params.who)

  // add the role
  const currentRoles = govern.roles
  currentRoles.push(role.id)
  govern.roles = currentRoles

  govern.save()
}

export function handleRevoked(event: RevokedEvent): void {
  const govern = loadOrCreateGovern(event.address)

  const role = roleRevoked(event.address, event.params.role, event.params.who)

  // add the role
  const currentRoles = govern.roles
  currentRoles.push(role.id)
  govern.roles = currentRoles

  govern.save()
}

// Helpers

export function loadOrCreateGovern(entity: Address): GovernEntity {
  const governId = entity.toHexString()
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
