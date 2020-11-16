import Whitelist, {ListItem} from '../db/Whitelist'
import jwt, {SignOptions, VerifyOptions} from 'jsonwebtoken'
import {verifyMessage} from '@ethersproject/wallet';
import {arrayify} from '@ethersproject/bytes'

export interface JWTOptions {
    sign: SignOptions,
    verify: VerifyOptions
}

export default class Authenticator {
    /**
     * @param {Whitelist} whitelist 
     * @param {string} secret
     * @param {SignOptions} jqtOptions
     *  
     * @constructor
     */
    constructor(
        private whitelist: Whitelist,
        private secret: string, 
        private jwtOptions?: JWTOptions
    ) { }

    /**
     * Checks if the given public key is existing in the whitelist and if no rate limit is exceeded
     * 
     * @method authenticate
     * 
     * @param {string} message - The message from the user
     * @param {string} signature - The sent signature from the user
     * 
     * @returns Promise<boolean | string> - Returns false or the JWT
     * 
     * @public
     */
    public async authenticate(message: string, signature: string): Promise<boolean | string> {
        const publicKey = verifyMessage(arrayify(message), signature);

        if (await this.whitelist.getItemByKey(publicKey)) {
            return jwt.sign({data: publicKey}, this.secret, this.jwtOptions.sign)
        }

        return false
    }

    /**
     * Verifiey the given JWT 
     * 
     * @method verify
     * 
     * @param {string} token
     * 
     * @returns {boolean}
     * 
     * @public 
     */
    public verify(token: string): boolean {
        try {
            jwt.verify(token, this.secret, this.jwtOptions.verify)   

            return true;
        } catch(error) {
            return false;
        }
    }
}
