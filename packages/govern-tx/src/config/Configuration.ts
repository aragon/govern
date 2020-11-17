import { JWTOptions } from '../auth/Authenticator';

export interface EthereumOptions {
    url: string
}

export interface DatabaseOptions {
    user: string,
    host: string,
    password: string,
    database: string,
    port: number
}

export interface AuthOptions {
    secret: string,
    cookieName: string
    jwtOptions?: JWTOptions
}

export interface ServerOptions {
    host: string,
    port: number,
    logLevel?: string
}

// TODO: Add if required input validations
export default class Configuration {
    /**
     * @param {EthereumOptions} _ethereum 
     * @param {DatabaseOptions} _database 
     * 
     * @constructor
     */
    constructor(
        private _ethereum: EthereumOptions,
        private _database: DatabaseOptions,
        private _auth: AuthOptions,
        private _server: ServerOptions,
    ) { }

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
     * Getter for the authentication options
     * 
     * @property auth
     * 
     * @returns {AuthOptions}
     * 
     * @public
     */
    public get auth(): AuthOptions {
        return this._auth;
    }

    /**
     * Setter for the authentication options
     * 
     * @property auth
     * 
     * @returns {void}
     * 
     * @public
     */
    public set auth(value: AuthOptions) {
        this._auth = value;
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
            auth: this._auth,
            server: this._server
        }
    }
}
