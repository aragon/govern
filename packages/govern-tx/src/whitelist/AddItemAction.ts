import AbstractWhitelistAction from "../../lib/whitelist/AbstractWhitelistAction";
import AbstractWhitelistAction from "../../lib/whitelist/AbstractWhitelistAction";

export default class AddItemAction extends AbstractWhitelistAction {
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
