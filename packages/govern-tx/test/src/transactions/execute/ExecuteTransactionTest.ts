import { EthereumOptions } from '../../../../src/config/Configuration'
import { Request } from '../../../../lib/AbstractAction'
import Provider from '../../../../src/provider/Provider'
import * as executeABI from '../../../../src/transactions/execute/execute.json'
import ExecuteTransaction from '../../../../src/transactions/execute/ExecuteTransaction'

// Mocks
jest.mock('../../../../lib/transactions/AbstractTransaction')

/**
 * ExecuteTransaction test
 */
describe('ExecuteTransactionTest', () => {
    let executeTransaction: ExecuteTransaction

    beforeEach(() => {
        executeTransaction = new ExecuteTransaction(
            {} as EthereumOptions,
            {} as Provider,
            {} as Request
        )
    })

    it('has the correct contract defined', () => {
        //@ts-ignore
        expect(executeTransaction.contract).toEqual('GovernQueue')
    })

    it('has the correct function abi defined', () => {
        //@ts-ignore
        expect(executeTransaction.functionABI).toEqual(executeABI)
    })
})
