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
  return `/daos/${daoName}/actions/executions/${containerHash}`;
}

export function proposalSettingsUrl(url: string): string {
  return `${url}/settings`;
}

export function proposalNewActionsUrl(url: string): string {
  return `${url}/actions/new`;
}

export const DaoNotFoundUrl = `/daos/not-found`;
export const NewActionUrl = `actions/new`;
export const ActionDetailsUrl = `actions/executions/:id`;
export const DaoSettingsUrl = `settings`;
export const DaoFinanceUrl = `finance`;
export const NotFoundUrl = `/not-found`;
