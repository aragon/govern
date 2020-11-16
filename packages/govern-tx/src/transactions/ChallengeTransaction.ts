import AbstractTransaction from '../../lib/transactions/AbstractTransaction';

export default class ChallengeTransaction extends AbstractTransaction {
    protected signature: string = 'challenge(...)';
}