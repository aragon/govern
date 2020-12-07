import Wallet from '../../../src/wallet/Wallet'
import Database from '../../../src/db/Database'
import Provider from '../../../src/provider/Provider'
import { BaseProvider } from '@ethersproject/providers';

// Mocks
jest.mock('@ethersproject/providers')
jest.mock('../../../src/wallet/Wallet')
jest.mock('../../../src/db/Database')s
jest.mock('../../../lib/transactions/ContractFunction')

/**
 * Provider test
 */
describe('ProviderTest', () => {
    let provider: Provider,
    walletMock: Wallet,
    databaseMock: Database,
    baseProviderMock: BaseProvider;

    beforeEach(() => {
        new Database({
            host: 'host',
            port: 100,
            database: 'database',
            user: 'user',
            password: 'password'
        })
        databaseMock = (Database as jest.MockedClass<typeof Database>).mock.instances[0]
        
        new Wallet(databaseMock)
        walletMock = (Wallet as jest.MockedClass<typeof Wallet>).mock.instances[0]

        provider = new Provider(
            {
                url: 'url',
                blockConfirmations: 0,
                publicKey: 'publicKey',
                contracts: {GovernQueue: '0x00'}
            },
            walletMock
        )

        baseProviderMock = (BaseProvider as jest.MockedClass<typeof BaseProvider>).mock.instances[0]
    })

    it('calls sendTransaction and returns with the expected value', async () => {

    })

    it('calls sendTransaction and the wallet throws on signing', async () => {

    })

    it('calls sendTransaction and returns an prepopulating of the TX options throws', async () => {

    })

    it('calls sendTransaction and the BaseProvider throws on executing the request', async () => {

    })

    it('calls sendTransaction and the BaseProvider throws while waiting until it is mined', async () => {
        
    })
})
