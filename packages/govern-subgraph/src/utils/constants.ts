import { BigInt } from '@graphprotocol/graph-ts'

export const APPROVED_STATUS = 'Approved'
export const CANCELLED_STATUS = 'Cancelled'
export const CHALLENGED_STATUS = 'Challenged'
export const EXECUTED_STATUS = 'Executed'
export const NONE_STATUS = 'None'
export const REJECTED_STATUS = 'Rejected'
export const SCHEDULED_STATUS = 'Scheduled'

export const CHALLENGE_CONTAINER_EVENT = 'Challenge'
export const EXECUTE_CONTAINER_EVENT = 'Execute'
export const RESOLVE_CONTAINER_EVENT = 'Resolve'
export const RULE_CONTAINER_EVENT = 'Rule'
export const SCHEDULE_CONTAINER_EVENT = 'Schedule'
export const SUBMIT_EVIDENCE_CONTAINER_EVENT = 'SubmitEvidence'
export const VETO_CONTAINER_EVENT = 'Veto'

export const ALLOW_RULING = BigInt.fromI32(4)
