import Database from './Database'

export interface ListItem {
    PublicKey: string,
    Limit: number,
    Executed: number
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
        return this.db.query<ListItem[]>('SELECT * FROM whitelist')
    }

    /**
     * TODO: Check return values of postgres package
     * 
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
        return typeof (await this.getItemByKey(publicKey)) !== 'undefined'
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
    public async getItemByKey(publicKey: string): Promise<ListItem> {
        return (await this.db.query<ListItem[]>(`SELECT * FROM whitelist WHERE PublicKey='${publicKey}'`))[0]
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
        return this.db.query<ListItem>(`INSERT INTO whitelist (PublicKey, TxLimit) VALUES ('${publicKey}', '${rateLimit}')`)
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
        return (await this.db.query<ListItem[]>(`DELETE FROM whitelist WHERE PublicKey='${publicKey}'`)).length > 0
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
        return this.db.query<number>(`UPDATE whitelist SET Executed = Executed + 1 WHERE PublicKey='${publicKey}'`)
    }

    /**
     * Returns true if the limit isn't reached otherwise false
     * 
     * @method increaseExecutionCounter
     * 
     * @param {string} publicKey 
     * 
     * @returns {Promise<boolean>}
     * 
     * @public
     */
    public async limitReached(publicKey: string): Promise<boolean> {
        const item: ListItem = await this.getItemByKey(publicKey)

        return (item.Executed + 1) >= item.Limit
    }
}
