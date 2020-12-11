import { FastifySchema, FastifyRequest } from 'fastify'

export interface Params {
    message: string | any,
    signature: string,
}

export default abstract class AbstractAction<T> {
    /**
     * The given request by the user
     * 
     * @var {Request} parameters
     */
    protected request: FastifyRequest;

    /**
     * @param {Request} parameters 
     * 
     * @constructor
     */
    constructor(request: FastifyRequest) {
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
    protected validateRequest(request: FastifyRequest): FastifyRequest {
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
    public abstract execute(): Promise<T>

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
                    message: {
                        oneOf: [
                          { type: 'string'},
                          { type: 'object'}
                        ]
                      },
                    signature: { type: 'string' }
                }
            }
        } as FastifySchema
    }
}
