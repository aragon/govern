import Wallet from '../wallet/Wallet'
import { BaseProvider, TransactionRequest } from '@ethersproject/providers'
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import ContractFunction from '../../lib/transactions/ContractFunction'
import Configuration from '../config/Configuration'

export default class Provider {
    /**
     * The base provider of ethers.js
     * 
     * @property {BaseProvider} provider
     * 
     * @private
     */
    private provider: BaseProvider

    /**
     * @param {Configuration} configuration 
     * @param {Wallet} wallet 
     * 
     * @constructor
     */
    constructor(private configuration: Configuration, private wallet: Wallet) {
        this.provider = new BaseProvider(this.configuration.ethereum.url)
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
                    this.configuration.ethereum.publicKey
                )
            )
        ).wait(
            this.configuration.ethereum.blockConfirmations
        )
    }

    /**
     * TODO: Add gas price definition (could get loaded from ethgasstation to a have average gas price)
     * 
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
            to: this.configuration.ethereum.contracts[contract],
            data: contractFunction.encode()
        }

        txOptions.gasLimit = await this.provider.estimateGas(txOptions)

        return txOptions
    }
}
