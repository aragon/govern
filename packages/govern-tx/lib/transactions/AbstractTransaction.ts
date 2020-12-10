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
        const contractFunction = new ContractFunction(
            this.functionABI,
            (this.request as Request).message
        )

        contractFunction.functionArguments[0].payload.submitter = this.config.publicKey

        return this.provider.sendTransaction(this.contract, contractFunction)
    } 

    /**
     * TODO: Test BigNumber handling of the response and the fastify schema validation
     * 
     * Returns the schema of a transaction command
     * 
     * @property {FastifySchema} schema
     * 
     * @returns {FastifySchema}
     */
    public static get schema(): FastifySchema {
        const schema = AbstractAction.schema

        schema.response = {
            200: {
                type: 'object',
                properties: {
                    to: { type: 'string' },
                    from: { type: 'string' },
                    contractAddress: { type: 'string' },
                    transactionIndex: { type: 'number' },
                    gasUsed: { type: 'object' }, // BigNumber
                    logsBloom: { type: 'string' },
                    blockHash: { type: 'string' },
                    transactionHash: { type: 'string' },
                    logs: { type: 'array' },
                    confirmations: { type: 'number' },
                    cumulativeGasUsed: { type: 'object'}, // BigNumber
                    byzantium: { type: 'boolean' },
                    status: { type: 'number' }
                }
            }
        }

        return schema
    }
}
