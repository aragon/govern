import { defaultAbiCoder, Fragment, JsonFragment } from '@ethersproject/abi';

export default class ContractFunction {
    /**
     * The decoded function arguments
     * 
     * @property {Result} functionArguments
     * 
     * @private
     */
    public functionArguments: any[];

    /**
     * The ABI item as ethers.js Fragment object
     * 
     * @property {Fragment} abiItem
     */
    private abiItem: Fragment;

    /**
     * @param {any} abiItem
     * @param {string} requestMsg
     * 
     * @constructor
     */
    constructor(
        abiItem: JsonFragment,
        private requestMsg: string,
    ) { 
        this.abiItem = Fragment.fromObject(abiItem)
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
        return defaultAbiCoder.encode(this.abiItem.inputs, this.functionArguments)
    }

    /**
     * Returns the decoded values by the given ABI item and the request message
     * 
     * @method decode
     * 
     * @returns {Result}
     * 
     * @public
     */
    public decode(): any[] {
        return defaultAbiCoder.decode(this.abiItem.inputs, this.requestMsg) as any[]
    }
}
