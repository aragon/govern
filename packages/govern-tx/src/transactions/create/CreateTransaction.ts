import { JsonFragment } from '@ethersproject/abi';
import AbstractTransaction from '../../../lib/transactions/AbstractTransaction'
import * as createABI from './create.json'

export default class CreateTransaction extends AbstractTransaction {
    /**
     * The contract name
     * 
     * @property {string} contract
     * 
     * @protected
     */
    protected contract: string = 'GovernBaseFactory'

    /**
     * The function ABI used to create a transaction
     * 
     * @property {JsonFragment} functionABI
     * 
     * @protected
     */
    protected functionABI: JsonFragment = createABI
}
