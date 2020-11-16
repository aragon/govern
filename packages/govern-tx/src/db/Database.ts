import Configuration from '../config/Configuration'

export default class Database {
    /** 
     * @param configuration - The configuration object of this service
     * 
     * @constructor
     */
    constructor(private configuration: Configuration) { }

    /**
     * Executes a query on the DB
     * 
     * @method query 
     * 
     * @param {string} query - The SQL statement
     * 
     * @returns {Promise<any>}
     * 
     * @public 
     */
    public query(query: string): Promise<any> {
        //TODO: Decide which DB to use (Should we share the DB with TheGraph?) and implement the DB adapter with the related driver
        return Promise.resolve(true)
    }
}