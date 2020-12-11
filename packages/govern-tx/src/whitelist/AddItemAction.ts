import {isAddress} from '@ethersproject/address'
import { FastifyRequest } from 'fastify'
import AbstractWhitelistAction, { WhitelistParams } from "../../lib/whitelist/AbstractWhitelistAction"
import {ListItem} from '../db/Whitelist'

export default class AddItemAction extends AbstractWhitelistAction {
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
        if (!isAddress((request.params as WhitelistParams).message.publicKey)) {
            throw new Error('Invalid public key passed!')
        }

        if ((request.params as WhitelistParams).message.rateLimit == 0) {
            throw new Error('Invalid rate limit passed!')
        }

        return request;
    }

    /**
     * Adds a new item to the whitelist
     * 
     * @method execute
     * 
     * @returns {Promise<ListItem>}
     * 
     * @public
     */
    public execute(): Promise<ListItem> {
        return this.whitelist.addItem(
            (this.request.params as WhitelistParams).message.publicKey,
            ((this.request.params as WhitelistParams).message.rateLimit as number)
        )
    }
}
