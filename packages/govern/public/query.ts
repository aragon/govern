import { DocumentNode } from 'graphql'
import { OperationResult } from '@urql/core'
import Configuration from '../internal/configuration/Configuration'

/**
 * Executes a custom GraphQL query against the govern server
 *
 * @param {DocumentNode} query
 * @param {Object} args
 *
 * @returns Promise<OperationResult>
 */
export async function query(query: DocumentNode, args: any = {}): Promise<OperationResult> {
  return Configuration.get().client.request(query, args)
}
