import {Wallet as EthersWallet} from '@ethersproject/wallet'
import { TransactionRequest } from '@ethersproject/providers';
import { DatabaseOptions } from '../../../src/config/Configuration';
import Database from '../../../src/db/Database';
import Wallet from '../../../src/wallet/Wallet';

// Mocks
jest.mock('../../../src/db/Database')
jest.mock('@ethersproject/wallet')

/**
 * Wallet test
 */
describe('WalletTest', () => {
    let wallet: Wallet,
    databaseMock: Database

    beforeEach(() => {
        new Database({} as DatabaseOptions)
        databaseMock = (Database as jest.MockedClass<typeof Database>).mock.instances[0]

        EthersWallet.prototype.signTransaction = jest.fn()

        wallet = new Wallet(databaseMock)
    })

   it('calls sign and returns the expected value', async () => {
        (databaseMock.query as jest.MockedFunction<typeof databaseMock.query>).mockReturnValueOnce(Promise.resolve(['0x01']));

        (EthersWallet.prototype.signTransaction as jest.MockedFunction<typeof EthersWallet.prototype.signTransaction>).mockReturnValueOnce(Promise.resolve('0x02'))

        await expect(wallet.sign({} as TransactionRequest, '0x00')).resolves.toEqual('0x02')

        expect(databaseMock.query).toHaveBeenNthCalledWith(1, `SELECT PrivateKey FROM wallet WHERE PublicKey='0x00'`)

        expect(EthersWallet).toHaveBeenNthCalledWith(1, '0x01')

        expect(EthersWallet.prototype.signTransaction).toHaveBeenNthCalledWith(1, {from: '0x00'})
   })

   it('calls sign and throws as expected', async () => {
        (databaseMock.query as jest.MockedFunction<typeof databaseMock.query>).mockReturnValueOnce(Promise.reject('NOPE'));

        await expect(wallet.sign({} as TransactionRequest, '0x00')).rejects.toEqual('NOPE')

        expect(databaseMock.query).toHaveBeenNthCalledWith(1, `SELECT PrivateKey FROM wallet WHERE PublicKey='0x00'`)
   })


   it('calls sign with another publicKey and releads to wallet for it', async () => {
        (databaseMock.query as jest.MockedFunction<typeof databaseMock.query>).mockReturnValueOnce(Promise.resolve(['0x01']));
        (databaseMock.query as jest.MockedFunction<typeof databaseMock.query>).mockReturnValueOnce(Promise.resolve(['0x03']));

        (EthersWallet.prototype.signTransaction as jest.MockedFunction<typeof EthersWallet.prototype.signTransaction>).mockReturnValue(Promise.resolve('0x02'))

        await expect(wallet.sign({} as TransactionRequest, '0x00')).resolves.toEqual('0x02')
        await expect(wallet.sign({} as TransactionRequest, '0x01')).resolves.toEqual('0x02')

        expect(databaseMock.query).toHaveBeenNthCalledWith(1, `SELECT PrivateKey FROM wallet WHERE PublicKey='0x00'`)

        expect(EthersWallet).toHaveBeenNthCalledWith(1, '0x01')

        expect(EthersWallet).toHaveBeenNthCalledWith(2, '0x03')

        expect(EthersWallet.prototype.signTransaction).toHaveBeenNthCalledWith(1, {from: '0x00'})

        expect(EthersWallet.prototype.signTransaction).toHaveBeenNthCalledWith(2, {from: '0x01'})
   })
})