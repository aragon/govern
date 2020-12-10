import { JsonRpcProvider, TransactionResponse } from '@ethersproject/providers';
import { BigNumber } from "@ethersproject/bignumber";
import { JsonFragment } from '@ethersproject/abi';
import ContractFunction from '../../../lib/transactions/ContractFunction';
import Wallet from '../../../src/wallet/Wallet'
import Database from '../../../src/db/Database'
import Provider from '../../../src/provider/Provider'

// Mocks
jest.mock('@ethersproject/providers')
jest.mock('../../../src/wallet/Wallet')
jest.mock('../../../lib/transactions/ContractFunction')

// Mock TX response class 
class TXResponse implements TransactionResponse {
    public hash = '0x00'
    public confirmations = 1
    public from = '0x00'
    public nonce = 0
    public gasLimit = BigNumber.from(0)
    public gasPrice = BigNumber.from(0)
    public data = '0x00'
    public value = BigNumber.from(0)
    public chainId = 0
    wait = jest.fn()
}

/**
 * Provider test
 */
describe('ProviderTest', () => {
    let provider: Provider,
    walletMock: Wallet,
    jsonRpcProviderMock: JsonRpcProvider,
    contractFunctionMock: ContractFunction;

    beforeEach(() => {
        new Wallet({} as Database)
        walletMock = (Wallet as jest.MockedClass<typeof Wallet>).mock.instances[0]

        new ContractFunction({} as JsonFragment, 'request')
        contractFunctionMock = (ContractFunction as jest.MockedClass<typeof ContractFunction>).mock.instances[0]

        provider = new Provider(
            {
                url: 'url',
                blockConfirmations: 0,
                publicKey: 'publicKey',
                contracts: {GovernQueue: '0x00'}
            },
            walletMock
        )

        jsonRpcProviderMock = (JsonRpcProvider as jest.MockedClass<typeof JsonRpcProvider>).mock.instances[0]
    })

    it('calls sendTransaction and returns with the expected value', async () => {
        const txResponse = new TXResponse()

        txResponse.wait.mockReturnValueOnce(Promise.resolve('RECEIPT'));

        (walletMock.sign as jest.MockedFunction<typeof walletMock.sign>).mockReturnValueOnce(Promise.resolve('0x00'));

        (contractFunctionMock.encode as jest.MockedFunction<typeof contractFunctionMock.encode>).mockReturnValue('0x00');

        (jsonRpcProviderMock.sendTransaction as jest.MockedFunction<typeof jsonRpcProviderMock.sendTransaction>).mockReturnValue(Promise.resolve(txResponse));

        (jsonRpcProviderMock.estimateGas as jest.MockedFunction<typeof jsonRpcProviderMock.estimateGas>).mockReturnValue(Promise.resolve(BigNumber.from(0)));

        await expect(provider.sendTransaction('GovernQueue', contractFunctionMock)).resolves.toEqual('RECEIPT');

        expect(jsonRpcProviderMock.sendTransaction).toHaveBeenNthCalledWith(1, '0x00');

        expect(txResponse.wait).toHaveBeenNthCalledWith(1, 0);

        expect(walletMock.sign).toHaveBeenNthCalledWith(
            1,
            {
                to: '0x00',
                data: '0x00',
                gasLimit: BigNumber.from(0)
            },
            'publicKey'
        );

        expect(contractFunctionMock.encode).toHaveBeenCalledTimes(1);
    })

    it('calls sendTransaction and the wallet throws on signing', async () => {
        (walletMock.sign as jest.MockedFunction<typeof walletMock.sign>).mockReturnValueOnce(Promise.reject('NOPE'));

        (contractFunctionMock.encode as jest.MockedFunction<typeof contractFunctionMock.encode>).mockReturnValue('0x00');

        (jsonRpcProviderMock.estimateGas as jest.MockedFunction<typeof jsonRpcProviderMock.estimateGas>).mockReturnValue(Promise.resolve(BigNumber.from(0)));

        await expect(provider.sendTransaction('GovernQueue', contractFunctionMock)).rejects.toEqual('NOPE');

        expect(walletMock.sign).toHaveBeenNthCalledWith(
            1,
            {
                to: '0x00',
                data: '0x00',
                gasLimit: BigNumber.from(0)
            },
            'publicKey'
        );

        expect(contractFunctionMock.encode).toHaveBeenCalledTimes(1);
    })

    it('calls sendTransaction and estimation of the gas throws', async () => {
        (contractFunctionMock.encode as jest.MockedFunction<typeof contractFunctionMock.encode>).mockReturnValue('0x00');

        (jsonRpcProviderMock.estimateGas as jest.MockedFunction<typeof jsonRpcProviderMock.estimateGas>).mockReturnValue(Promise.reject('NOPE'));

        await expect(provider.sendTransaction('GovernQueue', contractFunctionMock)).rejects.toEqual('NOPE');

        expect(contractFunctionMock.encode).toHaveBeenCalledTimes(1);
    })

    it('calls sendTransaction and encoding of the contract function throws', async () => {
        (contractFunctionMock.encode as jest.MockedFunction<typeof contractFunctionMock.encode>).mockImplementation(() => {throw 'NOPE'})

        await expect(provider.sendTransaction('GovernQueue', contractFunctionMock)).rejects.toEqual('NOPE');

        expect(contractFunctionMock.encode).toHaveBeenCalledTimes(1);
    })

    it('calls sendTransaction and the BaseProvider throws on executing the request', async () => {
        (walletMock.sign as jest.MockedFunction<typeof walletMock.sign>).mockReturnValueOnce(Promise.resolve('0x00'));

        (contractFunctionMock.encode as jest.MockedFunction<typeof contractFunctionMock.encode>).mockReturnValue('0x00');

        (jsonRpcProviderMock.sendTransaction as jest.MockedFunction<typeof jsonRpcProviderMock.sendTransaction>).mockReturnValue(Promise.reject('NOPE'));

        (jsonRpcProviderMock.estimateGas as jest.MockedFunction<typeof jsonRpcProviderMock.estimateGas>).mockReturnValue(Promise.resolve(BigNumber.from(0)));

        await expect(provider.sendTransaction('GovernQueue', contractFunctionMock)).rejects.toEqual('NOPE');

        expect(jsonRpcProviderMock.sendTransaction).toHaveBeenNthCalledWith(1, '0x00');

        expect(walletMock.sign).toHaveBeenNthCalledWith(
            1,
            {
                to: '0x00',
                data: '0x00',
                gasLimit: BigNumber.from(0)
            },
            'publicKey'
        );

        expect(contractFunctionMock.encode).toHaveBeenCalledTimes(1);
    })

    it('calls sendTransaction and the BaseProvider throws while waiting until it is mined', async () => {
        const txResponse = new TXResponse()

        txResponse.wait.mockReturnValueOnce(Promise.reject('NOPE'));

        (walletMock.sign as jest.MockedFunction<typeof walletMock.sign>).mockReturnValueOnce(Promise.resolve('0x00'));

        (contractFunctionMock.encode as jest.MockedFunction<typeof contractFunctionMock.encode>).mockReturnValue('0x00');

        (jsonRpcProviderMock.sendTransaction as jest.MockedFunction<typeof jsonRpcProviderMock.sendTransaction>).mockReturnValue(Promise.resolve(txResponse));

        (jsonRpcProviderMock.estimateGas as jest.MockedFunction<typeof jsonRpcProviderMock.estimateGas>).mockReturnValue(Promise.resolve(BigNumber.from(0)));

        await expect(provider.sendTransaction('GovernQueue', contractFunctionMock)).rejects.toEqual('NOPE');

        expect(jsonRpcProviderMock.sendTransaction).toHaveBeenNthCalledWith(1, '0x00');

        expect(txResponse.wait).toHaveBeenNthCalledWith(1, 0);

        expect(walletMock.sign).toHaveBeenNthCalledWith(
            1,
            {
                to: '0x00',
                data: '0x00',
                gasLimit: BigNumber.from(0)
            },
            'publicKey'
        );

        expect(contractFunctionMock.encode).toHaveBeenCalledTimes(1);
    })
})
