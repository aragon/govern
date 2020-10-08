import { Address, ethereum } from "@graphprotocol/graph-ts";
import {
  Executed as ExecutedEvent,
  Frozen as FrozenEvent,
  Granted as GrantedEvent,
  Revoked as RevokedEvent,
} from "../generated/templates/Eaglet/Eaglet";
import {
  Action as ActionEntity,
  Eaglet as EagletEntity,
  Execution as ExecutionEntity,
} from "../generated/schema";
import { frozenRoles, roleGranted, roleRevoked } from "./lib/MiniACL";

export function handleExecuted(event: ExecutedEvent): void {
  const eaglet = loadOrCreateEaglet(event.address);

  const execution = loadOrCreateExecution(event);

  createActions(event);

  // add the execution
  const currentExecutions = eaglet.executions;
  currentExecutions.push(execution.id);
  eaglet.executions = currentExecutions;

  execution.save();
  eaglet.save();
}

// MiniACL Events

export function handleFrozen(event: FrozenEvent): void {
  const eaglet = loadOrCreateEaglet(event.address);

  const roles = eaglet.roles!

  frozenRoles(roles, event.params.role);
}

export function handleGranted(event: GrantedEvent): void {
  const eaglet = loadOrCreateEaglet(event.address);

  // contemplar el caso en que se crea un nueva cola

  const role = roleGranted(event.address, event.params.role, event.params.who);

  // add the role
  const currentRoles = eaglet.roles;
  currentRoles.push(role.id);
  eaglet.roles = currentRoles;

  eaglet.save();
}

export function handleRevoked(event: RevokedEvent): void {
  const eaglet = loadOrCreateEaglet(event.address);

  const role = roleRevoked(event.address, event.params.role, event.params.who);

  // add the role
  const currentRoles = eaglet.roles;
  currentRoles.push(role.id);
  eaglet.roles = currentRoles;

  eaglet.save();
}

// Helpers

export function loadOrCreateEaglet(entity: Address): EagletEntity {
  const eagletId = entity.toHexString();
  // Create eaglet
  let eaglet = EagletEntity.load(eagletId);
  if (eaglet === null) {
    eaglet = new EagletEntity(eagletId);
    eaglet.address = entity;
    eaglet.executions = [];
    eaglet.roles = [];
  }
  return eaglet!;
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
