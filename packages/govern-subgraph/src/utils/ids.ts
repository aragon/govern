import { ethereum } from '@graphprotocol/graph-ts'

export function buildId(event: ethereum.Event): string {
  return event.transaction.hash.toHexString() + event.logIndex.toString()
}

export function buildIndexedId(containerHash: string, index: number): string {
  return containerHash + index.toString()
}
