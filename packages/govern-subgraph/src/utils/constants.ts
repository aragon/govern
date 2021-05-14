import { BigInt, Bytes } from '@graphprotocol/graph-ts'

export const APPROVED_STATUS = 'Approved'
export const CANCELLED_STATUS = 'Cancelled'
export const VETOED_STATUS = 'Vetoed'
export const CHALLENGED_STATUS = 'Challenged'
export const EXECUTED_STATUS = 'Executed'
export const NONE_STATUS = 'None'
export const REJECTED_STATUS = 'Rejected'
export const SCHEDULED_STATUS = 'Scheduled'

export let ALLOW_RULING = BigInt.fromI32(4)

export let ZERO_ADDRESS = Bytes.fromHexString("0x0000000000000000000000000000000000000000") as Bytes
