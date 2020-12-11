import { FastifySchema, FastifyRequest } from 'fastify';
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { JsonFragment } from '@ethersproject/abi';
import AbstractAction from '../AbstractAction'
import ContractFunction from '../transactions/ContractFunction'
import Provider from '../../src/provider/Provider'
import { EthereumOptions } from '../../src/config/Configuration';
import Whitelist from '../../src/db/Whitelist';
import { Params } from '../AbstractAction';
import { AuthenticatedRequest } from '../../src/auth/Authenticator';

export default abstract class AbstractTransaction extends AbstractAction<TransactionReceipt> {
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
     * @param {EthereumOptions} config - Ethereum related configurations
     * @param {Provider} provider - The Ethereum provider object
     * @param {Whitelist} whitelist - Whitelist DB adapter
     * @param {Request} request - The request body given by the user
     * @param {string} publicKey - The public key of the user
     * 
     * @constructor
     */
    constructor(
        private config: EthereumOptions,
        private provider: Provider,
        private whitelist: Whitelist,
        request: FastifyRequest,
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
    public async execute(): Promise<TransactionReceipt> {
        const contractFunction = new ContractFunction(
            this.functionABI,
            (this.request.params as Params).message
        )
        contractFunction.functionArguments[0].payload.submitter = this.config.publicKey

        let receipt: TransactionReceipt = await this.provider.sendTransaction(this.contract, contractFunction)

        if(!(this.request as AuthenticatedRequest).admin) {
            this.whitelist.increaseExecutionCounter((this.request as AuthenticatedRequest).publicKey)
        }

        return receipt;
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
