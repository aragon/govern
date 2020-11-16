import AbstractTransaction from '../../lib/transactions/AbstractTransaction';

export default class ExecuteTransaction extends AbstractTransaction {
    protected signature: string = 'execute(...)';
}
