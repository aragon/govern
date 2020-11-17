
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

// TODO: Add if required input validations
export default class Configuration {
    /**
     * @param {EthereumOptions} _ethereum 
     * @param {DatabaseOptions} _database 
     * 
     * @constructor
     */
    constructor(private _ethereum: EthereumOptions, private _database: DatabaseOptions) { }

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
            database: this._database
        }
    }
}
