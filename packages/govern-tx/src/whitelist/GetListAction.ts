import AbstractWhitelistAction from '../../lib/whitelist/AbstractWhitelistAction';
import {ListItem} from '../db/Whitelist'

export default class GetListAction extends AbstractWhitelistAction {
    /**
     * Adds a new item to the whitelist
     * 
     * @method execute
     * 
     * @returns {Promise<ListItem[]>}
     * 
     * @public
     */
    public execute(): Promise<ListItem[]> {
        return this.whitelist.getList()
    }
}
