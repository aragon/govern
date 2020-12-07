import { FastifyRequest } from 'fastify';
import { verifyMessage } from '@ethersproject/wallet';
import { arrayify } from '@ethersproject/bytes'
import { Unauthorized, HttpError } from 'http-errors'
import Whitelist from '../db/Whitelist'
import Admin from '../db/Admin';

export default class Authenticator {
    /**
     * @property {HttpError} NOT_ALLOWED
     * 
     * @private
     */
    private NOT_ALLOWED: HttpError = new Unauthorized('Not allowed action!')

    /**
     * @param {Whitelist} whitelist 
     * @param {Admin} admin
     *  
     * @constructor
     */
    constructor(private whitelist: Whitelist, private admin: Admin) { }

    /**
     * Checks if the given public key is existing and if this account is allowed to execute the requested action
     * 
     * @method authenticate
     * 
     * @param {FastifyRequest} request - The fastify request object
     * @param {FastifyReply} reply - The fastify response object
     * 
     * @returns Promise<undefined>
     * 
     * @public
     */
    public async authenticate(request: FastifyRequest): Promise<undefined> {
        if (
            await this.hasPermission(
                request.routerPath,
                verifyMessage(
                    //@ts-ignore
                    arrayify(request.body.message),
                    //@ts-ignore
                    request.body.signature
                )
            )
        ) {
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
}
