import Configuration from '../internal/configuration/Configuration'

/**
 * Executes a custom GraphQL query against the govern server
 *
 * @param {string} query
 * @param {Object} args
 *
 * @returns Promise<any> - Returns the data object or throws an error
 */
export function query(query: string, args: any = {}): Promise<any> {
  return Configuration.get().client.request(query, args)
}
