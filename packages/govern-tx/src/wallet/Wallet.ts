import {Wallet as EthersWallet} from '@ethersproject/wallet'
import { TransactionRequest } from '@ethersproject/providers'
import Database from '../db/Database'

export interface WalletItem {
    PrivateKey: string
    PublicKey: string
}

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
     * The public key of the loaded wallet account
     * 
     * @property {string} publicKey
     * 
     * @private
     */
    private publicKey: string;

    /**
     * @param {Database} db - Database adapter
     * 
     * @constructor
     */
    constructor(private db: Database) { }

     /**
      * Signs the given contract function with the Aragon privateKey
      * 
      * @method sign
      * 
      * @param {TransactionRequest} txOptions 
      * @param {string} publicKey
      * 
      * @returns {Promise<string>}
      * 
      * @public
      */
    public async sign(txOptions: TransactionRequest, publicKey: string): Promise<string> {
        await this.loadWallet(publicKey)

        txOptions.from = publicKey

        return this.wallet.signTransaction(txOptions)
    }

    /**
     * Returns the ethers wallet instance prepopulated with the Aragon privateKey
     * 
     * @method loadWallet
     * 
     * @param {string} publicKey
     * 
     * @returns {EthersWallet}
     * 
     * @private
     */
    private async loadWallet(publicKey: string): Promise<void> {
        if (!this.wallet || this.publicKey !== publicKey) {
            const pk = (await this.db.query<string[]>(`SELECT PrivateKey FROM wallet WHERE PublicKey='${publicKey}'`))[0];
            this.wallet = new EthersWallet(pk)
            this.publicKey = publicKey;
        }
    }
}
