import { Configured as ConfiguredEvent } from '../generated/templates/OptimisticQueue/OptimisticQueue'
import { OptimisticQueue, Config, Collateral } from '../generated/schema'


export function handleConfigured(event: ConfiguredEvent): void {
  let queue = OptimisticQueue.load(event.address.toHexString())
  // TODO: Can there be no queue? check event processing order
  const config = new Config(event.address.toHexString())

  const scheduleCollateral = new Collateral(event.transaction.hash.toHexString() + '1')
  scheduleCollateral.token = event.params.config.scheduleDeposit.token
  scheduleCollateral.amount = event.params.config.scheduleDeposit.amount

  const challengeCollateral = new Collateral(event.transaction.hash.toHexString() + '2')
  challengeCollateral.token = event.params.config.challengeDeposit.token
  challengeCollateral.amount = event.params.config.challengeDeposit.amount

  const vetoCollateral = new Collateral(event.transaction.hash.toHexString() + '3')
  vetoCollateral.token = event.params.config.vetoDeposit.token
  vetoCollateral.amount = event.params.config.vetoDeposit.amount

  config.executionDelay = event.params.config.executionDelay
  config.scheduleDeposit = scheduleCollateral.id
  config.challengeDeposit = challengeCollateral.id
  config.vetoDeposit = vetoCollateral.id
  config.resolver = event.params.config.resolver
  config.rules = event.params.config.rules

  queue.config = config.id

  queue.save()
  config.save()
  scheduleCollateral.save()
  challengeCollateral.save()
  vetoCollateral.save()
}

