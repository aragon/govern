import AbstractAction, { Request } from '../AbstractAction'
import ContractFunction from '../transactions/ContractFunction'
import Configuration from '../../src/config/Configuration'
import { hexDataSlice } from 'ethers/lib/utils';

// TODO: Use type from ethers
export interface TransactionReceipt {}

export interface TransactionRequest extends Request {
    function: ContractFunction
}

export default abstract class AbstractTransaction extends AbstractAction {
    /**
     * The function identifier used to create a transaction
     * 
     * @property {string} functionABI
     * 
     * @protected
     */
    protected functionABI: any;

    /**
     * @param {Request} request - The request body given by the user
     * @param {Configuration} configuration - The configuration object to execute the transaction
     * 
     * @constructor
     */
    constructor(private configuration: Configuration, request: TransactionRequest) {
        super(request);
    }

    /**
     * Validates the given request body.
     * 
     * @method validateRequest
     * 
     * @param {TransactionRequest} request - The request body given by the user
     * 
     * @public
     */
    public validateRequest(request: TransactionRequest) {
        request.function = new ContractFunction(this.functionABI, request.message)

        return request;
    }

    /**
     * Executes the transaction and returns the TransactionReceipt
     * 
     * @method execute
     * 
     * @returns {Promise<TransactionReceipt>} 
     * 
     * @public
     */
    public execute(): Promise<TransactionReceipt> {
        
    } 

    /**
     * TODO: Define response validation
     * 
     * Returns the schema of a transaction command
     * 
     * @property schema
     * 
     * @returns {any}
     */
    public static get schema(): any {
        return super.schema()
    }
}
