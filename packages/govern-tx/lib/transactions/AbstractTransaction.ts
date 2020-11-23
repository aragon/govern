import { FastifySchema } from 'fastify';
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import AbstractAction, { Request } from '../AbstractAction'
import ContractFunction from '../transactions/ContractFunction'
import Provider from '../../src/provider/Provider'
import { EthereumOptions } from '../../src/config/Configuration';

// TODO: Overthink dependency handling of AbstractTransaction -> Provider -> Wallet and the configuration. Ignoring separation of concerns for Provider/Wallet?
export default abstract class AbstractTransaction extends AbstractAction {
    /**
     * The function ABI used to create a transaction
     * 
     * @property {Object} functionABI
     * 
     * @protected
     */
    protected functionABI: any // TODO: Create functionABI object interface definition 

    /**
     * The contract name
     * 
     * @property {string} contract
     * 
     * @protected
     */
    protected contract: string

    /**
     * The contract function
     * 
     * @property {ContractFunction} contractFunction
     * 
     * @private
     */
    private contractFunction: ContractFunction

    /**
     * @param {EthereumOptions} config
     * @param {Provider} provider - The Ethereum provider object
     * @param {Request} request - The request body given by the user
     * 
     * @constructor
     */
    constructor(
        private config: EthereumOptions, // TODO: Overthink configuration handling. I have the feeling I'm injecting it to often. 
        private provider: Provider,
        request: Request
    ) {
        super(request);

        this.contractFunction = new ContractFunction(
            this.functionABI,
            request.message
        )
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
        // TODO: This handling doesn't look that clean. Find a better solution also without code duplication.
        this.contractFunction.functionArguments.container.payload.submitter = this.config.publicKey

        return this.provider.sendTransaction(this.contract, this.contractFunction)
    } 

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
        return super.schema
    }
}
