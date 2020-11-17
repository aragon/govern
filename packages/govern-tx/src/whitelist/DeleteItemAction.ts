import {isAddress} from '@ethersproject/address'
import AbstractWhitelistAction from "../../lib/whitelist/AbstractWhitelistAction";

export default class DeleteItemAction extends AbstractWhitelistAction {
    /**
      * Validates the given parameters.
      * 
      * @method validateParameters 
      * 
      * @param {Object} parameters 
      * 
      * @returns {Object}
      * 
      * @protected
      */
     protected validateParameters(parameters: any): any {
        if (!isAddress(this.parameters.message.publicKey)) {
            throw new Error('Invalid public key passed!')
        }

        return parameters;
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
        return this.whitelist.deleteItem(this.parameters.message.publicKey);
    }
}
