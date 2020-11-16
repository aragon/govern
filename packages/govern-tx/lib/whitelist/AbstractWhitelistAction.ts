import AbstractAction from '../AbstractAction'
import Whitelist, {ListItem} from '../../src/db/Whitelist'

export default abstract class AbstractWhitelistAction extends AbstractAction {
    /**
     * @param {any} parameters - The given parameters by the user
     * @param {Whitelist} whitelist - The whitelist DB adapter
     * 
     * @constructor
     */
    constructor(private whitelist: Whitelist, parameters: any = {}) {
        super(parameters)
    }

    /**
     * Executes the actual action
     * 
     * @method execute
     * 
     * @returns {Promise<ListItem | ListItem[] | boolean>}
     * 
     * @public
     */
    public abstract execute(): Promise<ListItem | ListItem[] | boolean>
}
