import {isAddress} from '@ethersproject/address'
import { FastifyRequest } from 'fastify';
import AbstractWhitelistAction, { WhitelistParams } from "../../lib/whitelist/AbstractWhitelistAction";

export default class DeleteItemAction extends AbstractWhitelistAction<boolean> {
    /**
      * Validates the given request body.
      * 
      * @method validateRequest 
      * 
      * @param {FastifyRequest} request 
      * 
      * @returns {FastifyRequest}
      * 
      * @protected
      */
     protected validateRequest(request: FastifyRequest): FastifyRequest {
        if (!isAddress((request.body as WhitelistParams).message.publicKey)) {
            throw new Error('Invalid public key passed!')
        }

        return request;
    }

    /**
     * Adds a new item to the whitelist
     * 
     * @method execute
     * 
     * @returns {Promise<boolean>}
     * 
     * @public
     */
    public execute(): Promise<boolean> {
        return this.whitelist.deleteItem((this.request.body as WhitelistParams).message.publicKey);
    }
}
