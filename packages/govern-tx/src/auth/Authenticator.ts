
export default class Authenticator {
    /**
     * Checks if the given public key is existing in the whitelist and if no rate limit is exceeded
     * 
     * @param {string} signedMessage - The signed message from the user
     * 
     * @returns Promise<boolean>
     * 
     * @public
     */
    public authenticate(signedMessage: string): Promise<boolean> {
        return Promise.resolve(true);
    }

    /**
     * TODO: If a DB is in usage can we remove this method
     * 
     * Checks if the rate limit of the given account is execeeded or if the globally set is
     * 
     * @method isRateLimitExceeded
     * 
     * @param {string} publicKey - Public key of the user
     * 
     * @returns {boolean}
     * 
     * @private
     */
    private isRateLimitExceeded(publicKey: string): boolean {
        return false;
    }

    /**
     * TODO: If a DB is in usage can we remove this method
     * 
     * Checks if the given public key is existing in the whitelist
     * 
     * @method isKnown
     * 
     * @param {string} publicKey - Public key of the user
     * 
     * @returns {boolean}
     *  
     * @private
     */
    private isKnown(publicKey: string): boolean {
        return true; // TODO: implement whitelist check
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
}