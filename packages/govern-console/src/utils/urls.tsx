/**
 * Returns the url of the DAO's settings page
 *
 * @param daoName the name of the DAO
 *
 * @returns {string} the url of the settings page
 */
export function settingsUrl(daoName: string): string {
  return `/daos/${daoName}/dao-settings`;
}

/**
 * Returns the url of the Proposal details page
 * @param daoName the name of the DAO
 * @param containerHash the proposal container hash
 * @returns {string} the url of the proposal details page
 */
export function proposalDetailsUrl(daoName: string, containerHash: string): string {
  return `/daos/${daoName}/executions/${containerHash}`;
}
