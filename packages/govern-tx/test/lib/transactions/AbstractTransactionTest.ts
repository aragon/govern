import { Request } from '../../../lib//AbstractAction';
import Provider from '../../../src/provider/Provider';
import Wallet from '../../../src/wallet/Wallet';
import { JsonFragment } from '@ethersproject/abi';
import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { EthereumOptions } from '../../../src/config/Configuration';
import AbstractAction from '../../../lib/AbstractAction';
import ContractFunction from '../../../lib/transactions/ContractFunction';
import AbstractTransaction from '../../../lib/transactions/AbstractTransaction';

// Mocks
class MockTransaction extends AbstractTransaction {
    protected functionABI = {}
    protected contract = 'CONTRACT_NAME'
}

jest.mock('../../../src/provider/Provider')
jest.mock('../../../lib/transactions/ContractFunction')

/**
 * AbstractTransaction test
 */
describe('AbstractTransactionTest', () => {
    let txAction: MockTransaction,
    providerMock: Provider,
    contractFunctionMock: ContractFunction

    beforeEach(() => {
        new Provider({} as EthereumOptions, {} as Wallet)
        providerMock = (Provider as jest.MockedClass<typeof Provider>).mock.instances[0]

        ContractFunction.prototype.functionArguments = [{payload: {submitter: ''}}]

        txAction = new MockTransaction(
            {
                publicKey: '0x00'
            } as EthereumOptions,
            providerMock,
            {
                message: 'MESSAGE'
            } as Request
        )
    })

    it('calls execute and returns the expected value', async () => {
        (providerMock.sendTransaction as jest.MockedFunction<typeof providerMock.sendTransaction>).mockReturnValueOnce(Promise.resolve({} as TransactionReceipt))
        
        await expect(txAction.execute()).resolves.toEqual({})

        contractFunctionMock = (ContractFunction as jest.MockedClass<typeof ContractFunction>).mock.instances[0]

        expect(ContractFunction).toHaveBeenNthCalledWith(1, {} as JsonFragment, 'MESSAGE')

        expect(providerMock.sendTransaction).toHaveBeenNthCalledWith(1, 'CONTRACT_NAME', contractFunctionMock)

        expect(contractFunctionMock.functionArguments[0].payload.submitter).toEqual('0x00')
    })

    it('calls execute and throws as expected', async () => {
        (providerMock.sendTransaction as jest.MockedFunction<typeof providerMock.sendTransaction>).mockReturnValueOnce(Promise.reject('NOPE'))
        
        await expect(txAction.execute()).rejects.toEqual('NOPE')

        contractFunctionMock = (ContractFunction as jest.MockedClass<typeof ContractFunction>).mock.instances[0]
        
        expect(ContractFunction).toHaveBeenNthCalledWith(1, {} as JsonFragment, 'MESSAGE')

        expect(providerMock.sendTransaction).toHaveBeenNthCalledWith(1, 'CONTRACT_NAME', contractFunctionMock)

        expect(contractFunctionMock.functionArguments[0].payload.submitter).toEqual('0x00')
    })

    it('has the correct schema defined', () => {
        expect(AbstractTransaction.schema).toEqual(Object.assign(AbstractAction.schema, AbstractTransaction.schema))
    })
})
