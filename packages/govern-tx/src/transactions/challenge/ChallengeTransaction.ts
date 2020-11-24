import { JsonFragment } from '@ethersproject/abi';
import AbstractTransaction from '../../../lib/transactions/AbstractTransaction'
import * as challengeABI from './challenge.json'

export default class ChallengeTransaction extends AbstractTransaction {
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
    protected functionABI: JsonFragment = challengeABI
}
