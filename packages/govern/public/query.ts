import { DocumentNode } from 'graphql'
import { getConfiguration } from './configure'

/**
 * TODO: Use QueryResult type from govern-server/core
 *
 * Executes a custom GraphQL query against the govern server
 *
 * @param {DocumentNode} query
 * @param {Object} args
 *
 * @returns Promise<any>
 */
export async function query(query: DocumentNode, args: any = {}): Promise<any> {
  return getConfiguration().client.request(query, args)
}
