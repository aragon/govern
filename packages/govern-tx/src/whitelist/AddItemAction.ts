import {isAddress} from '@ethersproject/address'
import AbstractWhitelistAction, { WhitelistRequest } from "../../lib/whitelist/AbstractWhitelistAction"
import {ListItem} from '../db/Whitelist'

export default class AddItemAction extends AbstractWhitelistAction {
    /**
      * Validates the given request body.
      * 
      * @method validateRequest 
      * 
      * @param {WhitelistRequest} request 
      * 
      * @returns {WhitelistRequest}
      * 
      * @protected
      */
     protected validateRequest(request: WhitelistRequest): WhitelistRequest {
        if (!isAddress(request.message.publicKey)) {
            throw new Error('Invalid public key passed!')
        }

        if (request.message.rateLimit == 0) {
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
            (this.request as WhitelistRequest).message.publicKey,
            (this.request as WhitelistRequest).message.rateLimit
        )
    }
}
