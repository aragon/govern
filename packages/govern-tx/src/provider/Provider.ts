import { JsonRpcProvider, TransactionRequest } from '@ethersproject/providers'
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import Wallet from '../wallet/Wallet'
import { EthereumOptions } from '../config/Configuration';
import ContractFunction from '../../lib/transactions/ContractFunction'

// TODO: Check populating of TX options
export default class Provider {
    /**
     * The base provider of ethers.js
     * 
     * @property {BaseProvider} provider
     * 
     * @private
     */
    private provider: JsonRpcProvider

    /**
     * @param {EthereumOptions} config 
     * @param {Wallet} wallet 
     * 
     * @constructor
     */
    constructor(private config: EthereumOptions, private wallet: Wallet) {
        this.provider = new JsonRpcProvider(this.config.url)
    }

    /**
     * Sends the transaction and returns the receipt after the configured block confirmations are reached
     * 
     * @method sendTransaction
     * 
     * @param {string} contract 
     * @param {ContractFunction} contractFunction 
     * 
     * @returns {Promise<TransactionReceipt>}
     */
    public async sendTransaction(contract: string, contractFunction: ContractFunction): Promise<TransactionReceipt> {
        return (
            await this.provider.sendTransaction(
                await this.wallet.sign(
                    await this.getTransactionOptions(
                        contract,
                        contractFunction
                    ),
                    this.config.publicKey
                )
            )
        ).wait(
            this.config.blockConfirmations
        )
    }

    /**
     * Returns the transaction options
     * 
     * @method getTransactionOptions
     * 
     * @param {string} contract - The name of the contract 
     * @param {ContractFunction} contractFunction - The ContractFunction object 
     * 
     * @returns {Promise<TransactionRequest>} 
     */
    private async getTransactionOptions(contract: string, contractFunction: ContractFunction): Promise<TransactionRequest> {
        const txOptions: TransactionRequest = {
            to: this.config.contracts[contract],
            data: contractFunction.encode()
        }

        txOptions.gasLimit = await this.provider.estimateGas(txOptions)

        return txOptions
    }
}
