import { JsonFragment } from '@ethersproject/abi';
import AbstractTransaction from '../../../lib/transactions/AbstractTransaction'
import * as executeABI from './execute.json'

export default class ExecuteTransaction extends AbstractTransaction {
    /**
     * The contract name
     * 
     * @property {string} contract
     * 
     * @protected
     */
    protected contract: string = 'GovernQueue'

    /**
     * The function ABI used to create a transaction
     * 
     * @property {JsonFragment} functionABI
     * 
     * @protected
     */
    protected functionABI: JsonFragment = executeABI
}
