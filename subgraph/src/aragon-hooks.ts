import { Address, log } from '@graphprotocol/graph-ts'
import { loadAppConfig } from './helpers'

/*
 * Called when an app proxy is detected.
 *
 * Return the name of a data source template if you would like to create it for a given appId.
 * Return null otherwise.
 *
 * The returned name is used to instantiate a template declared in the subgraph manifest file,
 * which must have the same name.
 */

// gardens-dependency.open.aragonpm.eth
// 0x16c0b0af27b5e169e5f678055840d7ab2b312519d7700a06554c287619f4b9f9
// appId on xadai
// 0xbc5e8545c829b4a2dd66039e0824a32c19e8159e699402865a9e18746f99c390
// conviction-voting.open.aragonpm.eth
// 0x589851b3734f6578a92f33bfc26877a1166b95238be1f484deeaac6383d14c38
export function getTemplateForApp(appId: string): string | null {
  log.debug('appid {}', [appId])
  if (
    appId ==
    '0xbc5e8545c829b4a2dd66039e0824a32c19e8159e699402865a9e18746f99c390'
  ) {
    return 'ConvictionVoting'
  } else {
    return null
  }
}

export function onOrgTemplateCreated(orgAddress: Address): void {}
export function onAppTemplateCreated(appAddress: Address, appId: string): void {
  loadAppConfig(appAddress)
}
export function onTokenTemplateCreated(tokenAddress: Address): void {}
