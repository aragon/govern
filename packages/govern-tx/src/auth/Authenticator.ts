import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import jwt, {SignOptions, VerifyOptions} from 'jsonwebtoken'
import {verifyMessage} from '@ethersproject/wallet';
import {arrayify} from '@ethersproject/bytes'
import { Unauthorized, HttpError } from 'http-errors'
import fastifyCookie from 'fastify-cookie'
import Whitelist from '../db/Whitelist'
import Admin from '../db/Admin';

export interface JWTOptions {
    sign: SignOptions,
    verify: VerifyOptions
}

export default class Authenticator {
    /**
     * @property {HttpError}
     * 
     * @private
     */
    private NOT_ALLOWED: HttpError = new Unauthorized('Not allowed action!')

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
     * Checks if the given public key is existing and if this account is allowed to execute the requested action
     * 
     * @method authenticate
     * 
     * @param {string} message - The message from the user
     * @param {string} signature - The sent signature from the user
     * 
     * @returns Promise<undefined>
     * 
     * @public
     */
    public async authenticate(request: FastifyRequest, reply: FastifyReply): Promise<undefined> {
        const cookie = request.cookies[this.cookieName];
        const publicKey: string = verifyMessage(arrayify(request.body.message), request.body.signature);

        if (cookie && this.verify(cookie)) {
            if (!(await this.hasPermission(request.routerPath, publicKey))) {
                throw this.NOT_ALLOWED
            }

            return
        } 

        if (await this.hasPermission(request.routerPath, publicKey)) {
            reply.setCookie(
                this.cookieName,
                jwt.sign(
                    {data: publicKey},
                    this.secret,
                    this.jwtOptions.sign
                ),
                {secure: true}
            )

            return
        } 

        throw this.NOT_ALLOWED
    }

    /**
     * Checks if the current requesting user has permissions
     * 
     * @method hasPermission
     * 
     * @param {string} routerPath 
     * @param {string} publicKey
     * 
     * @returns {Promise<boolean>}
     * 
     * @private 
     */
    private async hasPermission(routerPath: string, publicKey: string): Promise<boolean> {
        if (
            routerPath !== '/whitelist' && 
            (await this.whitelist.keyExists(publicKey) || await this.admin.isAdmin(publicKey))
        ) {
            return true
        }

        if (routerPath === '/whitelist' && this.admin.isAdmin(publicKey)) {
            return true
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
    private verify(token: string): boolean {
        try {
            jwt.verify(token, this.secret, this.jwtOptions.verify)   

            return true;
        } catch(error) {
            return false;
        }
    }
}
