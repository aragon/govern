import {Wallet as EthersWallet} from '@ethersproject/wallet'
import Database from '../db/Database'
import ContractFunction from '../../lib/transactions/ContractFunction'

export default class Wallet {
    /**
     * The used wallet object to sign a transaction 
     * 
     * @property {EthersWallet} wallet
     * 
     * @private
     */
    private wallet: EthersWallet

    /**
     * @param {Database} db - Database adapter
     * 
     * @constructor
     */
    constructor(private db: Database) {}

     /**
      * Signs the given contract function with the Aragon privateKey
      * 
      * @method sign
      * 
      * @param {ContractFunction} contractFunction 
      * 
      * @returns {Promise<string>}
      * 
      * @public
      */
    public async sign(contractFunction: ContractFunction): Promise<string> {
        return (await this.getWallet()).signTransaction(contractFunction.toTransaction())
    }

    /**
     * Returns the ethers wallet instance prepopulated with the Aragon privateKey
     * 
     * @method getWallet
     * 
     * @returns {EthersWallet}
     * 
     * @private
     */
    private async getWallet(): Promise<EthersWallet> {
        if (!this.wallet) {
            this.wallet = new EthersWallet(await this.db.query("SELECT PrivateKey FROM wallet WHERE id='0'"))
        }

        return this.wallet
    }
}