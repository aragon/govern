import Whitelist, {ListItem} from '../db/Whitelist'

// TODO: Implement Request object from Fastify
export default class Authenticator {
    /**
     * 
     * @param {Whitelist} whitelist 
     */
    constructor(private whitelist: Whitelist) { }

    /**
     * Checks if the given public key is existing in the whitelist and if no rate limit is exceeded
     * 
     * @param {string} signedMessage - The signed message from the user
     * 
     * @returns Promise<boolean>
     * 
     * @public
     */
    public async authenticate(signedMessage: string): Promise<boolean> {
        if (await this.getItem(signedMessage)) {
            return true
        }

        return false
    }

    /**
     * Extracts the public key from the given signed message
     * 
     * @method getPublicKey
     * 
     * @param signedMessage - The signed message from the user
     * 
     * @returns {boolean}
     * 
     * @private
     */
    private getPublicKey(signedMessage: string): string {
        return '0x0...';
    }

    /**
     * 
     * @method getItem
     * 
     * @param {string} signedMessage 
     * 
     * @returns {ListItem}
     * 
     * @private
     */
    private getItem(signedMessage: string): ListItem {
        return this.whitelist.getItemByKey(this.getPublicKey(signedMessage));
    }
}
