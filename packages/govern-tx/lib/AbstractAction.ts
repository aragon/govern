import { FastifySchema } from 'fastify'

export interface Request {
    message: string | any,
    signature: string
}

export default abstract class AbstractAction {
    /**
     * The given request by the user
     * 
     * @var {Request} parameters
     */
    protected request: Request | undefined;

    /**
     * @param {Request} parameters 
     * 
     * @constructor
     */
    constructor(request: Request | undefined) {
        this.request = this.validateRequest(request);
    }

     /**
      * Validates the given request body.
      * 
      * @method validateRequest 
      * 
      * @param {Request} request 
      * 
      * @returns {Request}
      * 
      * @protected
      */
    protected validateRequest(request: Request | undefined): Request | undefined {
        return request;
    }

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

    /**
     * Returns the required request schema
     * 
     * @property schema
     * 
     * @returns {FastifySchema}
     */
    public static get schema(): FastifySchema {
        return {
            body: {
                type: 'object',
                required: ['message', 'signature'],
                properties: {
                    message: { type: 'string' },
                    signature: { type: 'string' }
                }
            }
        } as FastifySchema
    }
}
