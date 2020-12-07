/* istanbul ignore file */
// Ignore added because VOs doesn't have to be tested especially if they do not have any logic

export interface EthereumOptions {
    url: string
    blockConfirmations: number
    publicKey: string
    contracts: {
        [name: string]: string
    }
}

export interface DatabaseOptions {
    user: string,
    host: string,
    password: string,
    database: string,
    port: number
}

export interface ServerOptions {
    host: string,
    port: number,
    logLevel?: string
}

export interface Config {
    ethereum: EthereumOptions,
    database: DatabaseOptions,
    server: ServerOptions
}

export default class Configuration {
    /**
     * The options to connect to a Ethereum node and how TXs should be handled 
     * 
     * @property {EthereumOptions} _ethereum
     * 
     * @private
     */
    private _ethereum: EthereumOptions

    /**
     * The options to connect to the Postgres database
     * 
     * @property {DatabaseOptions} _database
     * 
     * @private
     */
    private _database: DatabaseOptions

    /**
     * The options to configure fastify server
     * 
     * @property {ServerOptions} _server
     * 
     * @private
     */
    private _server: ServerOptions

    /**
     * @param {Config} config - The wrapper object for all configuration properties 
     * 
     * @constructor
     */
    constructor(
        config: Config
    ) {
        this.ethereum = config.ethereum
        this.database = config.database
        this.server = config.server
    }

    /**
     * Getter for the database options. 
     * 
     * @property database
     * 
     * @returns {DatabaseOptions}
     * 
     * @public
     */
    public get database(): DatabaseOptions {
        return this._database;
    }

    /**
     * Setter for the database options. 
     * 
     * @property database
     * 
     * @returns {void}
     * 
     * @public
     */
    public set database(value: DatabaseOptions) {
        this._database = value;
    }

    /**
     * Getter for ethereum node options
     * 
     * @property ethereum
     * 
     * @returns {EthereumOptions}
     * 
     * @public 
     */
    public get ethereum(): EthereumOptions {
        return this._ethereum;
    }

    /**
     * Setter for the ethereum node options
     * 
     * @property ethereum
     * 
     * @returns {EthereumOptions}
     * 
     * @public
     */
    public set ethereum(value: EthereumOptions) {
        this._ethereum = value;
    }

    /**
     * Getter for the server options
     * 
     * @property server
     * 
     * @returns {ServerOptions}
     * 
     * @public
     */
    public get server(): ServerOptions {
        return this._server;
    }

    /**
     * Setter for the server options
     * 
     * @property server
     * 
     * @returns {void}
     * 
     * @public
     */
    public set server(value: ServerOptions) {
        this._server = value;
    }

    /**
     * Returns the internal options object as new object
     * 
     * @method toObject
     * 
     * @returns {object}
     * 
     * @public
     */
    public toObject(): any {
        return {
            ethereum: this._ethereum,
            database: this._database,
            server: this._server
        }
    }
}
