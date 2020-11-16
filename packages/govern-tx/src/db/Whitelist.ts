import Database from './Database'

// TODO: Define DB schema to handle global rate limits and to have Admin public key

export interface ListItem {
    publicKey: string,
    rateLimit: number,
    executedTransactions: number
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
        return this.db.query('SELECT * from whitelist')
    }

    /**
     * Returns a item from the whitelist by his public key
     * 
     * @method getItemByKey
     * 
     * @param {string} publicKey - The public key to look for
     * 
     * @returns {Promise<ListItem>} 
     * 
     * @public 
     */
    public getItemByKey(publicKey: string): Promise<ListItem | undefined> {
        return this.db.query(`SELECT * from whitelist WHERE PublicKey='${publicKey}'`)
    }

    /**
     * Adds a new item to the whitelist
     * 
     * @method addItem
     * 
     * @param {string} publicKey - The public key we would like to add
     * 
     * @returns {Promise<boolean>}
     *  
     * @public
     */
    public addItem(publicKey: string, rateLimit: string): Promise<boolean> {
        return this.db.query(`INSERT INTO whitelist VALUES (${publicKey}, ${rateLimit})`);
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
    public deleteItem(publicKey: string): Promise<boolean> {
        return this.db.query(`DELETE FROM whitelist WHERE PublicKey='${publicKey}'`);
    }
}
