import Wallet from '../wallet/Wallet'
import { BaseProvider } from '@ethersproject/providers'
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import ContractFunction from '../lib/transactions/ContractFunction'
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
     * @param {ContractFunction} contractFunction 
     * 
     * @returns {Promise<TransactionReceipt>}
     */
    public async sendTransaction(contractFunction: ContractFunction): Promise<TransactionReceipt> {
        return (
            await this.provider.sendTransaction(
                await this.wallet.sign(contractFunction)
            )
        ).wait(
            this.configuration.ethereum.blockConfirmations
        )
    }
}
