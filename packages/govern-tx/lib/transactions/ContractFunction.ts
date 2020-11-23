import { defaultAbiCoder } from 'ethers/lib/utils';
import { Result } from '@ethersproject/abi';

export default class ContractFunction {
    /**
     * The decoded function arguments
     * 
     * @property functionArguments
     * 
     * @private
     */
    private functionArguments: any;

    /**
     * @param {any} abiItem
     * @param {string} requestMsg
     * 
     * @constructor
     */
    constructor(
        private abiItem,
        private requestMsg: string,
    ) { 
        this.functionArguments = this.decode()
    }

    /**
     * Encodes the function by the given ABI item and the function parameters
     * 
     * @method encode
     * 
     * @returns {string}
     * 
     * @public  
     */
    public encode(): string {
        return defaultAbiCoder.encode(this.abiItem, this.functionArguments)
    }

    /**
     * Returns the decoded values by the given ABI item and the request message
     * 
     * @method decode
     * 
     * @returns {Result}
     * 
     * @private
     */
    public decode(): Result {
        return defaultAbiCoder.decode(this.abiItem, this.requestMsg)
    }
}
