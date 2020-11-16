import Whitelist from '../../src/db/Whitelist'

export default abstract class AbstractWhitelistAction {
    /**
     * @param {Whitelist} whitelist - The whitelist DB adapter
     * 
     * @constructor
     */
    constructor(private whitelist: Whitelist) {}

    /**
     * Executes the actual action
     * 
     * @method execute
     * 
     * @returns {Promise<any>}
     * 
     * @public
     */
    public abstract execute(): Promise<any>
}