import { OperationResult } from '@urql/core'
import Configuration from '../internal/configuration/Configuration'

/**
 * Executes a custom GraphQL query against the govern server
 *
 * @param {string} query
 * @param {Object} args
 *
 * @returns Promise<OperationResult>
 */
export function query(query: string, args: any = {}): Promise<OperationResult> {
  return Configuration.get().client.request(query, args)
}
