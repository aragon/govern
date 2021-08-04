import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts'
import {
  Executed as ExecutedEvent,
  Frozen as FrozenEvent,
  Granted as GrantedEvent,
  Revoked as RevokedEvent,
  Deposited as DepositedEvent,
  Withdrawn as WithdrawnEvent,
} from '../generated/templates/Govern/Govern'
import { Govern, Deposit, Withdraw } from '../generated/schema'
import { frozenRoles, roleGranted, roleRevoked } from './lib/MiniACL'
import { loadOrCreateContainer } from './GovernQueue'
import { handleContainerEventExecute } from './utils/events'
import { buildId, buildIndexedId } from './utils/ids'

export function handleExecuted(event: ExecutedEvent): void {
  let govern = loadOrCreateGovern(event.address)
  let container = loadOrCreateContainer(event.params.memo)

  handleContainerEventExecute(container, event)

  govern.save()
}

export function handleDeposited(event: DepositedEvent): void {
  let deposit = new Deposit(buildId(event));
  let govern = loadOrCreateGovern(event.address)
  deposit.reference = event.params._reference
  deposit.sender = event.params.sender;
  deposit.amount = event.params.amount;
  deposit.token = event.params.token;
  deposit.govern = govern.id;
  deposit.save();
}

export function handleWithdrawn(event: WithdrawnEvent): void {
  let withdraw = new Withdraw(buildId(event));
  let govern = loadOrCreateGovern(event.address)
  withdraw.reference = event.params._reference
  withdraw.from = event.params.from;
  withdraw.to = event.params.to;
  withdraw.amount = event.params.amount;
  withdraw.token = event.params.token;
  withdraw.govern = govern.id;
  withdraw.save();
}

// MiniACL Events
export function handleFrozen(event: FrozenEvent): void {
  let govern = loadOrCreateGovern(event.address)

  let roles = govern.roles!

  frozenRoles(roles, event.params.role)
}

export function handleGranted(event: GrantedEvent): void {
  let govern = loadOrCreateGovern(event.address)

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

export function loadOrCreateGovern(entity: Address): Govern {
  let governId = entity.toHex()
  // Create govern
  let govern = Govern.load(governId)
  if (govern === null) {
    govern = new Govern(governId)
    govern.address = entity
    govern.roles = []
  }
  return govern!
}
