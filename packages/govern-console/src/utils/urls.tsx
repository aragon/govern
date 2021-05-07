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
