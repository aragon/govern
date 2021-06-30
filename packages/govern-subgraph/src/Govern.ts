import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts'
import {
  Executed as ExecutedEvent,
  Frozen as FrozenEvent,
  Granted as GrantedEvent,
  Revoked as RevokedEvent,
  // ETHDeposited as ETHDepositedEvent,
} from '../generated/templates/Govern/Govern'
import { Govern, Deposit } from '../generated/schema'
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

// emit Deposited(msg.sender, _token, _amount, _reference);

// export function handleDeposited(event: Deposited): void {
//   // This would be useful if we store in the subgraph who deposited
//   // and how much
//   let govern = loadOrCreateGovern(event.address)
  
//   // govern.balance = event.params.value
//   // govern.save()
// }

// export function handleETHDeposited(event: DepositedEvent): void {
//   // This would be useful if we store in the subgraph who deposited
//   // and how much
//   let govern = loadOrCreateGovern(event.address)
//   let deposit = new Deposit(buildId(event));
  
//   deposit.amount = event.params.amount;
//   deposit.token = event.params.token;
//   deposit.sender = event.params.sender;
//   deposit.reference = event.params._reference;
//   deposit.save();
//   govern.save();

//   // govern.balance = event.params.value
//   // govern.save()
// }
// export function handleETHDeposited(event: ETHDepositedEvent): void {
//   // This would be useful if we store in the subgraph who deposited
//   // and how much
//   // let govern = loadOrCreateGovern(event.address)
//   // govern.balance = event.params.value
//   // govern.save()
// }

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
