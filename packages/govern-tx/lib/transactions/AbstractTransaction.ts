import { FastifySchema } from 'fastify';
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { JsonFragment } from '@ethersproject/abi';
import AbstractAction, { Request } from '../AbstractAction'
import ContractFunction from '../transactions/ContractFunction'
import Provider from '../../src/provider/Provider'
import { EthereumOptions } from '../../src/config/Configuration';

export default abstract class AbstractTransaction extends AbstractAction {
    /**
     * The function ABI used to create a transaction
     * 
     * @property {Object} functionABI
     * 
     * @protected
     */
    protected functionABI: JsonFragment

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
        private config: EthereumOptions,
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
        this.contractFunction.functionArguments[0].payload.submitter = this.config.publicKey

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
