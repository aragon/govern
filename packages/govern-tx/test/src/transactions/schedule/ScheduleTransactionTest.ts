import { EthereumOptions } from '../../../../src/config/Configuration'
import { Request } from '../../../../lib/AbstractAction'
import Provider from '../../../../src/provider/Provider'
import * as scheduleABI from '../../../../src/transactions/schedule/schedule.json'
import ScheduleTransaction from '../../../../src/transactions/schedule/ScheduleTransaction'

// Mocks
jest.mock('../../../../lib/transactions/AbstractTransaction')

/**
 * ScheduleTransaction test
 */
describe('ScheduleTransaction Test', () => {
    let scheduleTransaction: ScheduleTransaction

    beforeEach(() => {
        scheduleTransaction = new ScheduleTransaction(
            {} as EthereumOptions,
            {} as Provider,
            {} as Request
        )
    })

    it('has the correct contract defined', () => {
        //@ts-ignore
        expect(scheduleTransaction.contract).toEqual('GovernQueue')
    })

    it('has the correct function abi defined', () => {
        //@ts-ignore
        expect(scheduleTransaction.functionABI).toEqual(scheduleABI)
    })
})
