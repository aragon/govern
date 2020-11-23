export interface Request {
    message: string | any,
    signature: string
}

export default abstract class AbstractAction {
    /**
     * The parameters used to create the transaction
     * 
     * @var {Request} parameters
     */
    protected request: Request;

    /**
     * @param {Request} parameters 
     * 
     * @constructor
     */
    constructor(request: Request) {
        this.request = this.validateRequest(request);
     }

     /**
      * Validates the given request body.
      * 
      * @method validateRequest 
      * 
      * @param {Request} request 
      * 
      * @returns {Object}
      * 
      * @protected
      */
    protected validateRequest(request: Request): any {
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
     * Returns the schema of a whitelist command
     * 
     * @property schema
     * 
     * @returns {any}
     */
    public static get schema(): any {
        return {
            body: {
                type: 'object',
                required: ['message', 'signature'],
                properties: {
                    message: { type: 'string' },
                    signature: { type: 'string' }
                }
            }
        }
    }
}
