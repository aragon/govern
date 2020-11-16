import AbstractWhitelistAction from "../../lib/whitelist/AbstractWhitelistAction";

export default class DeleteItemAction extends AbstractWhitelistAction {
    /**
     * Adds a new item to the whitelist
     * 
     * @method execute
     * 
     * @returns {Promise<boolean>}
     * 
     * @public
     */
    public execute(): Promise<boolean> {
        return Promise.resolve(true)
    }
}
