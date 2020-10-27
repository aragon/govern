import { Bytes, ethereum } from '@graphprotocol/graph-ts'

export function buildId(event: ethereum.Event): string {
  return event.transaction.hash.toHexString() + event.logIndex.toString()
}

export function buildActionId(containerHash: Bytes, index: number): string {
  return containerHash.toHexString() + index.toString()
}
