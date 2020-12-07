import Database from './Database'

export interface AdminItem {
    PublicKey: string
}

export default class Admin {
    /**
     * @param {Database} db - The Database adapter
     * 
     * @constructor 
     */
    constructor(private db: Database) {}

    /**
     * Checks if a given publicKey does have admin rights
     * 
     * @method isAdmin
     * 
     * @param {string} publicKey
     * 
     * @returns {boolean} 
     */
    public async isAdmin(publicKey: string): Promise<boolean> {
        return (await this.db.query(`SELECT * FROM admins WHERE PublicKey='${publicKey}'`)).length > 0
    }

    /**
     * Adds a admin record
     * 
     * @method addAdmin
     * 
     * @param {string} publicKey 
     * 
     * @returns {AdminItem}
     * 
     * @public
     */
    public addAdmin(publicKey: string): Promise<AdminItem> {
        return this.db.query(`INSERT INTO admins VALUES (${publicKey})`)
    }

    /**
     * Deletes a admin record
     * 
     * @method deleteAdmin
     * 
     * @param {string} publicKey
     * 
     * @returns {boolean}
     * 
     * @public 
     */
    public async deleteAdmin(publicKey: string): Promise<boolean> {
        return (await this.db.query(`DELETE FROM admins WHERE PublicKey='${publicKey}'`)).length > 0
    }

    /**
     * Returns all admin records
     * 
     * @method getAdmins
     * 
     * @returns {AdminItem[]}
     * 
     * @public
     */
    public getAdmins(): Promise<AdminItem[]> {
        return this.db.query('SELECT * from admins')
    }
}
