import Database from './Database'

// TODO: Define DB schema to handle global rate limits and to have Admin public key

export interface ListItem {
    PublicKey: string,
    RateLimit: number,
    ExecutedTransactions: number
}

export default class Whitelist {
    /**
     * @param {Database} db - The Database adapter
     * 
     * @constructor 
     */
    constructor(private db: Database) {}

    /**
     * Returns the whitelist
     * 
     * @method getList
     * 
     * @returns {Promise<ListItem[]>}
     */
    public getList(): Promise<ListItem[]> {
        return this.db.query('SELECT * FROM whitelist')
    }

    /**
     * Checks if a key is existing
     * 
     * @method keyExists
     * 
     * @param {string} publicKey - The public key to look for
     * 
     * @returns {Promise<boolean}
     * 
     * @public
     */
    public async keyExists(publicKey: string): Promise<boolean> {
        return (await this.getItemByKey(publicKey)).length > 0
    }

    /**
     * Returns a item from the whitelist by his public key
     * 
     * @method getItemByKey
     * 
     * @param {string} publicKey - The public key to look for
     * 
     * @returns {Promise<ListItem[]>} 
     * 
     * @public 
     */
    public getItemByKey(publicKey: string): Promise<ListItem[]> {
        return this.db.query(`SELECT * FROM whitelist WHERE PublicKey='${publicKey}'`)
    }

    /**
     * Adds a new item to the whitelist
     * 
     * @method addItem
     * 
     * @param {string} publicKey - The public key we would like to add
     * @param {number} rateLimit - The amount of allowed transactions for this user
     * 
     * @returns {Promise<ListItem>}
     *  
     * @public
     */
    public addItem(publicKey: string, rateLimit: number): Promise<ListItem> {
        return this.db.query(`INSERT INTO whitelist VALUES (${publicKey}, ${rateLimit})`)
    }

    /**
     * Removes a item from the whitelist
     *  
     * @method deleteItem 
     * 
     * @param publicKey - The public key to delete
     * 
     * @returns {Promise<boolean>}
     * 
     * @public
     */
    public async deleteItem(publicKey: string): Promise<boolean> {
        return (await this.db.query(`DELETE FROM whitelist WHERE PublicKey='${publicKey}'`)).length > 0
    }

    /**
     * Increases the execution counter
     * 
     * @method increaseExecutionCounter
     * 
     * @param {string} publicKey 
     * 
     * @returns {Promise<number>}
     * 
     * @public
     */
    public async increaseExecutionCounter(publicKey: string): Promise<number> {
        return this.db.query(`UPDATE whitelist SET Executed = Executed + 1 WHERE PublicKey='${publicKey}'`)
    }
}
