import { DocumentNode } from 'graphql';
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
export declare function query(query: DocumentNode, args?: any): Promise<any>;
