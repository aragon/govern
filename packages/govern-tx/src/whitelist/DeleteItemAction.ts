import {isAddress} from '@ethersproject/address'
import AbstractWhitelistAction, { WhitelistRequest } from "../../lib/whitelist/AbstractWhitelistAction";
import {ListItem} from '../db/Whitelist'

export default class DeleteItemAction extends AbstractWhitelistAction {
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
        return this.whitelist.deleteItem(this.request.message.publicKey);
    }
}
