import ClientInterface from '../clients/lib/ClientInterface'
import GraphQLClient from '../clients/graphql/GraphQLClient'
import { DAO_FACTORY_ADDRESS, GOVERN_REGISTRY_ADDRESS } from './ConfigDefaults'

export interface ConfigurationObject {
  subgraphURL?: string
  daoFactoryAddress?: string
  tokenStorageProof?: string
  governRegistry?: string
}

let defaultConfig: Configuration
const subgraphURL =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-govern-mainnet'

/**
 * @class Configuration
 */
export default class Configuration {
  /**
   * Holds the validated configuration object
   *
   * @var config
   *
   * @private
   */
  private config: {
    subgraphURL: string
    client: ClientInterface
    daoFactoryAddress: string
    governRegistry: string
  }

  /**
   * @param {Object} config
   *
   * @constructor
   */
  constructor(config: any) {
    this.setConfig(config)
  }

  /**
   * TODO: Use a ConfigurationError object
   *
   * Does set and parse the given configuration object
   *
   * @method setConfig
   *
   * @returns {void}
   *
   * @private
   */
  private setConfig(config: any): void {
    if (!config.subgraphURL) {
      throw new Error('Missing Govern subgraph URL!')
    }

    if (!config.daoFactoryAddress) {
      throw new Error('Missing Dao factory address!')
    }

    this.config = {
      subgraphURL: config.subgraphURL,
      client: new GraphQLClient(config.subgraphURL),
      daoFactoryAddress: config.daoFactoryAddress,
      governRegistry: config.governRegistry,
    }
  }

  /**
   * Getter for subgraphURL
   *
   * @var subgraphURL
   *
   * @returns {string}
   *
   * @public
   */
  get subgraphURL(): string {
    return this.config.subgraphURL
  }

  /**
   * Getter for client property
   *
   * @var client
   *
   * @returns {ClientInterface}
   *
   * @public
   */
  get client(): ClientInterface {
    return this.config.client
  }

  /**
   * Getter for daoFactoryAddress property
   *
   * @var daoFactoryAddress
   *
   * @returns {string}
   *
   * @public
   */
  get daoFactoryAddress(): string {
    return this.config.daoFactoryAddress
  }

  /**
   * Getter for governRegistry property
   *
   * @var governRegistry
   *
   * @returns {string}
   *
   * @public
   */
  get governRegistry(): string {
    return this.config.governRegistry
  }

  /**
   * Static setter/factory method of the Configuration class
   *
   * @method set
   *
   * @param {ConfigurationObject} config
   *
   * @returns {void}
   *
   * @public
   */
  static set(config?: ConfigurationObject): void {
    if (!config) {
      config = {}
    }

    if (!config.subgraphURL) {
      config.subgraphURL = subgraphURL
    }

    if (!config.daoFactoryAddress) {
      config.daoFactoryAddress = DAO_FACTORY_ADDRESS
    }

    if (!config.governRegistry) {
      config.governRegistry = GOVERN_REGISTRY_ADDRESS
    }

    defaultConfig = new Configuration(config)
  }

  /**
   * Static getter for the defaultConfig (used in the public API layer)
   *
   * @method get
   *
   * @returns {Configuration}
   *
   * @public
   */
  static get(): Configuration {
    if (typeof defaultConfig !== 'undefined') {
      return defaultConfig
    }

    Configuration.set()

    return defaultConfig
  }
}
