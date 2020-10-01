import { Configured as ConfiguredEvent } from '../generated/templates/OptimisticQueue/OptimisticQueue'
import { OptimisticQueue } from '../generated/schema'

export function handleConfigured(event: ConfiguredEvent): void {
  let queue = OptimisticQueue.load(event.address.toHexString())
  // TODO: Can there be no queue? check event processing order
}

