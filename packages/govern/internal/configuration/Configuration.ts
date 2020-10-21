import ClientInterface from '../clients/lib/ClientInterface'
import GraphQLClient from '../clients/GraphQLClient'

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
    governURL: string;
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
    if (!config.governURL) {
      throw new Error('Missing Govern server URL!')
    }

    this.governURL = config.governURL
    this.client = new GraphQLClient(this.config.governURL)
  }

  /**
   * Getter for governURL
   *
   * @var governURL
   *
   * @public
   */
  get governURL() {
    return this.config.governURL
  }

  /**
   * Setter for governURL property
   *
   * @param {string} value
   *
   * @var governURL
   *
   * @public
   */
  set governURL(value: string) {
    this.config.governURL = value
  }

  /**
   * Getter for client property
   *
   * @var client
   *
   * @public
   */
  get client(): ClientInterface {
    return this.config.client;
  }

  /**
   * Setter for the client property
   *
   * @param {ClientInterface} value
   *
   * @var client
   *
   * @public
   */
  set client(value: ClientInterface) {
    this.config.client = value
  }
}
