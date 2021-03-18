import ClientInterface from '../clients/lib/ClientInterface'
import GraphQLClient from '../clients/graphql/GraphQLClient'

export interface ConfigurationObject {
  subgraphURL?: string
}

let defaultConfig: Configuration
const subgraphURL = 'https://api.thegraph.com/subgraphs/name/aragon/aragon-govern-rinkeby'

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
    subgraphURL: string;
    client: ClientInterface
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

    this.config = {
      subgraphURL: config.subgraphURL,
      client: new GraphQLClient(config.subgraphURL)
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
