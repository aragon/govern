import AbstractAction from '../AbstractAction'
import Configuration from '../../src/config/Configuration'

// TODO: Use type from ethers
export interface TransactionReceipt {}

export default abstract class AbstractTransaction extends AbstractAction {
    /**
     * The function signature used to create a transaction
     * 
     * @var {string} signature
     * 
     * @protected
     */
    protected signature: string;

    /**
     * @param {Object} parameters - The given parameters by the user
     * @param {Configuration} configuration - The configuration object to execute the transaction
     * 
     * @constructor
     */
    constructor(parameters: any, private configuration: Configuration) {
        super(parameters);
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
    public abstract execute(): Promise<TransactionReceipt> 
}
