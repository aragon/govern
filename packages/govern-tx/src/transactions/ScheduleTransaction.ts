import AbstractTransaction from '../../lib/transactions/AbstractTransaction';

export default class ScheduleTransaction extends AbstractTransaction {
    protected signature: string = 'schedule(...)';
}
