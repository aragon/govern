import { FastifyRequest, FastifySchema } from 'fastify';
import AbstractAction, { Params } from '../AbstractAction'
import Whitelist, {ListItem} from '../../src/db/Whitelist'

export interface WhitelistParams extends Params {
    message: {
        publicKey: string,
        txLimit?: number
    }
}

export default abstract class AbstractWhitelistAction<T> extends AbstractAction<T> {
    /**
     * @param {Whitelist} whitelist - The whitelist database entitiy
     * @param {WhitelistRequest} request - The given request body by the user
     * 
     * @constructor
     */
    constructor(protected whitelist: Whitelist, request: FastifyRequest) {
        super(request)
    }

    /**
     * Executes the actual action
     * 
     * @method execute
     * 
     * @returns {Promise<T>}
     * 
     * @public
     */
    public abstract execute(): Promise<T>

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
