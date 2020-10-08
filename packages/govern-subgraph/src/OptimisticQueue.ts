import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import {
  Challenged as ChallengedEvent,
  Configured as ConfiguredEvent,
  Executed as ExecutedEvent,
  Frozen as FrozenEvent,
  Granted as GrantedEvent,
  Resolved as ResolvedEvent,
  Revoked as RevokedEvent,
  Scheduled as ScheduledEvent,
  Vetoed as VetoedEvent,
  Ruled as RuledEvent,
  EvidenceSubmitted as EvidenceSubmittedEvent,
  OptimisticQueue as OptimisticQueueContract,
} from "../generated/templates/OptimisticQueue/OptimisticQueue";
import {
  Config as ConfigEntity,
  Challenge as ChallengeEntity,
  Collateral as CollateralEntity,
  Evidence as EvidenceEntity,
  Item as ItemEntity,
  OptimisticQueue as OptimisticQueueEntity,
  Veto as VetoEntity,
} from "../generated/schema";
import { frozenRoles, roleGranted, roleRevoked } from "./lib/MiniACL";

const NONE_STATUS = "None";
const APPROVED_STATUS = "Approved";
const CANCELLED_STATUS = "Cancelled";
const CHALLENGED_STATUS = "Challenged";
const EXECUTED_STATUS = "Executed";
const REJECTED_STATUS = "Rejected";
const SCHEDULED_STATUS = "Scheduled";
const VETOED_STATUS = "Vetoed";

const ALLOW_RULING = BigInt.fromI32(4);

export function handleScheduled(event: ScheduledEvent): void {
  const queue = loadOrCreateQueue(event.address);

  const item = loadOrCreateItem(event.params.containerHash, event);

  const scheduleDeposit = loadOrCreateCollateral(event, "1");
  scheduleDeposit.token = event.params.collateral.token;
  scheduleDeposit.amount = event.params.collateral.amount;

  item.status = SCHEDULED_STATUS;
  item.nonce = event.params.payload.nonce;
  item.executionTime = event.params.payload.executionTime;
  item.submitter = event.params.payload.submitter;
  item.executor = event.params.payload.executor.toHexString();
  item.proof = event.params.payload.proof;
  item.collateral = scheduleDeposit.id;

  // add the item
  const currentItem = queue.queue;
  currentItem.push(item.id);
  queue.queue = currentItem;

  item.save();
  queue.save();
}

export function handleExecuted(event: ExecutedEvent): void {
  // TODO: (Gabi) decide if we want to handle executinons here

  const item = loadOrCreateItem(event.params.containerHash, event);

  item.status = EXECUTED_STATUS;

  item.save();
}

export function handleChallenged(event: ChallengedEvent): void {
  const item = loadOrCreateItem(event.params.containerHash, event);

  item.status = CHALLENGED_STATUS;

  const challenge = loadOrCreateChallenge(item.id, event);

  const challengeDeposit = loadOrCreateCollateral(event, "2");
  challengeDeposit.token = event.params.collateral.token;
  challengeDeposit.amount = event.params.collateral.amount;

  challenge.challenger = event.params.actor;
  challenge.item = item.id;
  challenge.arbitrator = loadOrCreateConfig(event.address).resolver;
  challenge.disputeId = event.params.resolverId;
  challenge.collateral = challengeDeposit.id;

  item.save();
  challenge.save();
}

export function handleResolved(event: ResolvedEvent): void {
  const item = loadOrCreateItem(event.params.containerHash, event);
  const challenge = loadOrCreateChallenge(item.id, event);

  item.status = event.params.approved ? EXECUTED_STATUS : CANCELLED_STATUS;

  challenge.approved = event.params.approved;

  item.save();
  challenge.save();
}

export function handleVetoed(event: VetoedEvent): void {
  const item = loadOrCreateItem(event.params.containerHash, event);

  item.status = VETOED_STATUS;

  const veto = loadOrCreateVeto(item.id, event);

  const vetoDeposit = loadOrCreateCollateral(event, "3");
  vetoDeposit.token = event.params.collateral.token;
  vetoDeposit.amount = event.params.collateral.amount;

  veto.item = item.id;
  veto.reason = event.params.reason;
  veto.submitter = event.params.actor;
  veto.collateral = vetoDeposit.id;

  item.save();
  veto.save();
}

export function handleConfigured(event: ConfiguredEvent): void {
  const queue = loadOrCreateQueue(event.address);
  const config = loadOrCreateConfig(event.address);

  const scheduleDeposit = loadOrCreateCollateral(event, "1");
  scheduleDeposit.token = event.params.config.scheduleDeposit.token;
  scheduleDeposit.amount = event.params.config.scheduleDeposit.amount;

  const challengeDeposit = loadOrCreateCollateral(event, "2");
  challengeDeposit.token = event.params.config.challengeDeposit.token;
  challengeDeposit.amount = event.params.config.challengeDeposit.amount;

  const vetoDeposit = loadOrCreateCollateral(event, "3");
  vetoDeposit.token = event.params.config.vetoDeposit.token;
  vetoDeposit.amount = event.params.config.vetoDeposit.amount;

  config.executionDelay = event.params.config.executionDelay;
  config.scheduleDeposit = scheduleDeposit.id;
  config.challengeDeposit = challengeDeposit.id;
  config.vetoDeposit = vetoDeposit.id;
  config.resolver = event.params.config.resolver;
  config.rules = event.params.config.rules;

  queue.config = config.id;

  scheduleDeposit.save();
  challengeDeposit.save();
  vetoDeposit.save();
  config.save();
  queue.save();
}

// IArbitrable Events

export function handleEvidenceSubmitted(event: EvidenceSubmittedEvent): void {
  const optimisticQueue = OptimisticQueueContract.bind(event.address);

  const containerHash = optimisticQueue.disputeItemCache(
    event.params.arbitrator,
    event.params.disputeId
  );

  const evidenceId = buildId(event);
  const evidence = new EvidenceEntity(evidenceId);

  evidence.challenge = containerHash.toHexString();
  evidence.submitter = event.params.submitter;
  evidence.data = event.params.evidence;
  evidence.createdAt = event.block.timestamp;

  evidence.save();
}

export function handleRuled(event: RuledEvent): void {
  const optimisticQueue = OptimisticQueueContract.bind(event.address);

  const containerHash = optimisticQueue.disputeItemCache(
    event.params.arbitrator,
    event.params.disputeId
  );

  const item = loadOrCreateItem(containerHash, event);
  const challenge = loadOrCreateChallenge(item.id, event);

  item.status =
    event.params.ruling === ALLOW_RULING ? APPROVED_STATUS : REJECTED_STATUS;

  challenge.ruling = event.params.ruling;

  item.save();
  challenge.save();
}

// MiniACL Events

export function handleFrozen(event: FrozenEvent): void {
  const queue = loadOrCreateQueue(event.address);

  const roles = queue.roles!

  frozenRoles(roles, event.params.role);
}

export function handleGranted(event: GrantedEvent): void {
  const queue = loadOrCreateQueue(event.address);

  const role = roleGranted(event.address, event.params.role, event.params.who);

  // add the role
  const currentRoles = queue.roles;
  currentRoles.push(role.id);
  queue.roles = currentRoles;

  queue.save();
}

export function handleRevoked(event: RevokedEvent): void {
  const queue = loadOrCreateQueue(event.address);

  const role = roleRevoked(event.address, event.params.role, event.params.who);

  // add the role
  const currentRoles = queue.roles;
  currentRoles.push(role.id);
  queue.roles = currentRoles;

  queue.save();
}

// Helpers

export function loadOrCreateQueue(entity: Address): OptimisticQueueEntity {
  const queueId = entity.toHexString();
  // Create queue
  let queue = OptimisticQueueEntity.load(queueId);
  if (queue === null) {
    queue = new OptimisticQueueEntity(queueId);
    queue.address = entity;
    queue.queue = [];
    queue.executions = [];
    queue.roles = [];
  }
  return queue!;
}

function loadOrCreateConfig(entity: Address): ConfigEntity {
  const configId = entity.toHexString();
  // Create config
  let config = ConfigEntity.load(configId);
  if (config === null) {
    config = new ConfigEntity(configId);
    config.queue = entity.toHexString();
  }
  return config!;
}

function loadOrCreateCollateral(
  event: ethereum.Event,
  index: String
): CollateralEntity {
  const collateralId = event.transaction.hash.toHexString() + index;
  // Create collateral
  let collateral = CollateralEntity.load(collateralId);
  if (collateral === null) {
    collateral = new CollateralEntity(collateralId);
  }
  return collateral!;
}

function loadOrCreateItem(
  containerHash: Bytes,
  event: ethereum.Event
): ItemEntity {
  const itemId = containerHash.toHexString();
  // Create item
  let item = ItemEntity.load(itemId);
  if (item === null) {
    item = new ItemEntity(itemId);
    item.status = NONE_STATUS;
    item.actions = [];
    item.createdAt = event.block.timestamp;
  }
  return item!;
}

function loadOrCreateVeto(vetoId: string, event: ethereum.Event): VetoEntity {
  // Create veto
  let veto = VetoEntity.load(vetoId);
  if (veto === null) {
    veto = new VetoEntity(vetoId);
    veto.queue = event.address.toHexString();
    veto.createdAt = event.block.timestamp;
  }
  return veto!;
}

function loadOrCreateChallenge(
  challengeId: string,
  event: ethereum.Event
): ChallengeEntity {
  // Create challenge
  let challenge = ChallengeEntity.load(challengeId);
  if (challenge === null) {
    challenge = new ChallengeEntity(challengeId);
    challenge.queue = event.address.toHexString();
    challenge.createdAt = event.block.timestamp;
  }
  return challenge!;
}

function buildId(event: ethereum.Event): string {
  return event.transaction.hash.toHexString() + event.logIndex.toString();
}
