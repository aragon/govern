import { FastifySchema } from 'fastify';
import AbstractAction, { Request } from '../AbstractAction'
import Whitelist, {ListItem} from '../../src/db/Whitelist'

export interface WhitelistRequest extends Request {
    message: {
        publicKey: string,
        rateLimit: number
    }
}

export default abstract class AbstractWhitelistAction extends AbstractAction {
    /**
     * @param {Whitelist} whitelist - The whitelist database entitiy
     * @param {WhitelistRequest} request - The given request body by the user
     * 
     * @constructor
     */
    constructor(protected whitelist: Whitelist, request?: WhitelistRequest) {
        super(request)
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

    /**
     * TODO: Define response validation
     * 
     * Returns the schema of a transaction command
     * 
     * @property {FastifySchema} schema
     * 
     * @returns {FastifySchema}
     */
    public static get schema(): FastifySchema {
        return AbstractAction.schema
    }
}
