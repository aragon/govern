import Whitelist, {ListItem} from '../db/Whitelist'
import Admin from '../db/Admin';
import jwt, {SignOptions, VerifyOptions} from 'jsonwebtoken'
import {verifyMessage} from '@ethersproject/wallet';
import {arrayify} from '@ethersproject/bytes'
import { Unauthorized } from 'http-errors'
import fastifyCookie from 'fastify-cookie'
import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

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
        private fastify: FastifyInstance,
        private whitelist: Whitelist,
        private admin: Admin,
        private secret: string, 
        private cookieName: string,
        private jwtOptions?: JWTOptions
    ) {
        fastify.register(fastifyCookie)
    }

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
    public async authenticate(request: FastifyRequest, reply: FastifyReply): Promise<undefined> {
        const cookie = request.cookies[this.cookieName];
        const publicKey: string = verifyMessage(arrayify(request.body.message), body.signature);

        if (cookie && this.verify(cookie)) {
            if (request.routerPath === '/whitelist' && !(await this.admin.isAdmin(publicKey))) {
                throw new Unauthorized('Not allowed action!')
            }

            return
        } 

        let token: string;

        if (
            (request.routerPath !== '/whitelist' && await this.whitelist.keyExists(publicKey)) ||
            (request.routerPath === '/whitelist' && await this.admin.isAdmin(publicKey))
        ) {
            token = jwt.sign({data: publicKey}, this.secret, this.jwtOptions.sign)
        } 

        if (!token) {
            throw new Unauthorized('Unknown account!')
        }

        reply.setCookie(this.cookieName, token, {secure: true})
        return
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
    private verify(token: string): boolean {
        try {
            jwt.verify(token, this.secret, this.jwtOptions.verify)   

            return true;
        } catch(error) {
            return false;
        }
    }
}
