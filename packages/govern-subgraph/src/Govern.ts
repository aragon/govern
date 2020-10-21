import { Address, ethereum } from "@graphprotocol/graph-ts";
import {
  Executed as ExecutedEvent,
  Frozen as FrozenEvent,
  Granted as GrantedEvent,
  Revoked as RevokedEvent,
} from "../generated/templates/Govern/Govern";
import {
  Action as ActionEntity,
  Govern as GovernEntity,
  Execution as ExecutionEntity,
} from "../generated/schema";
import { frozenRoles, roleGranted, roleRevoked } from "./lib/MiniACL";

export function handleExecuted(event: ExecutedEvent): void {
  const govern = loadOrCreateGovern(event.address);

  const execution = loadOrCreateExecution(event);

  createActions(event);

  // add the execution
  const currentExecutions = govern.executions;
  currentExecutions.push(execution.id);
  govern.executions = currentExecutions;

  execution.save();
  govern.save();
}

// MiniACL Events

export function handleFrozen(event: FrozenEvent): void {
  const govern = loadOrCreateGovern(event.address);

  const roles = govern.roles!

  frozenRoles(roles, event.params.role);
}

export function handleGranted(event: GrantedEvent): void {
  const govern = loadOrCreateGovern(event.address);

  // contemplar el caso en que se crea un nueva cola

  const role = roleGranted(event.address, event.params.role, event.params.who);

  // add the role
  const currentRoles = govern.roles;
  currentRoles.push(role.id);
  govern.roles = currentRoles;

  govern.save();
}

export function handleRevoked(event: RevokedEvent): void {
  const govern = loadOrCreateGovern(event.address);

  const role = roleRevoked(event.address, event.params.role, event.params.who);

  // add the role
  const currentRoles = govern.roles;
  currentRoles.push(role.id);
  govern.roles = currentRoles;

  govern.save();
}

// Helpers

export function loadOrCreateGovern(entity: Address): GovernEntity {
  const governId = entity.toHexString();
  // Create govern
  let govern = GovernEntity.load(governId);
  if (govern === null) {
    govern = new GovernEntity(governId);
    govern.address = entity;
    govern.executions = [];
    govern.roles = [];
  }
  return govern!;
}

function buildId(event: ethereum.Event): string {
  return event.transaction.hash.toHexString() + event.logIndex.toString();
}

function loadOrCreateExecution(event: ExecutedEvent): ExecutionEntity {
  const executionId = buildId(event);
  // Create execution
  let execution = ExecutionEntity.load(executionId);
  if (execution === null) {
    execution = new ExecutionEntity(executionId);
    execution.sender = event.params.actor;
    execution.results = event.params.execResults;
    // TODO: (Gabi) add queue relation
  }
  return execution!;
}

function createActions(event: ExecutedEvent): void {
  event.params.actions.forEach((actionData, index) => {
    const actionId = buildId(event) + "-action-" + index.toString();
    const action = new ActionEntity(actionId);

    action.execution =  buildId(event);
    action.to = actionData.to;
    action.value = actionData.value;
    action.data = actionData.data;

    action.save();
  });
}
