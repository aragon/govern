import { ethereum } from '@graphprotocol/graph-ts'

export function buildId(event: ethereum.Event): string {
  return event.transaction.hash.toHex() + event.logIndex.toString()
}

export function buildIndexedId(containerHash: string, index: number): string {
  return containerHash + index.toString()
}

export function buildEventHandlerId(
  containerHash: string,
  eventName: string,
  logIndex: string
): string {
  return containerHash + eventName + logIndex.toString()
}
