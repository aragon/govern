import { verifyMessage } from '@ethersproject/wallet';
import { arrayify } from '@ethersproject/bytes'
import { Unauthorized } from 'http-errors';
import { FastifyRequest } from 'fastify';
import Authenticator from '../../../src/auth/Authenticator';
import Admin from '../../../src/db/Admin';
import Whitelist from '../../../src/db/Whitelist';
import Database from '../../../src/db/Database';



// Mocks
jest.mock('../../../src/db/Admin')
jest.mock('../../../src/db/Whitelist')
jest.mock('../../../src/db/Database')
jest.mock('@ethersproject/wallet', () => {
    return {
        verifyMessage: jest.fn(() => {return '0x00'})
    }
})
jest.mock('@ethersproject/bytes', () => {
    return {
        arrayify: jest.fn((value) => {
            return value
        })
    }
})

/**
 * Authenticator test
 */
describe('AuthenticatorTest', () => {
    let authenticator: Authenticator,
    whitelistMock: Whitelist,
    databaseMock: Database,
    adminMock: Admin;

    const NO_ALLOWED = new Unauthorized('Not allowed action!');

    beforeEach(() => {
        databaseMock = new Database({
            user: 'user',
            host: 'host',
            password: 'password',
            database: 'databaseName',
            port: 1000
        })

        whitelistMock = new Whitelist(databaseMock)
        adminMock = new Admin(databaseMock)

        authenticator = new Authenticator(whitelistMock, adminMock)
    })

    it('calls authenticate as normal user and grants access to the transaction actions', async () => {
        const request = {
            routerPath: '/execute'
            body: {
                signature: '0x00',
                message: '0x00'
            }
        };

        whitelistMock.keyExists = jest.fn((publicKey) => {
            expect(publicKey).toEqual('0x00')
            
            return Promise.resolve(true)
        })

        await authenticator.authenticate(request as FastifyRequest)

        expect(verifyMessage).toHaveBeenNthCalledWith(1, request.body.message, request.body.signature)

        expect(arrayify).toHaveBeenNthCalledWith(1, request.body.message)
    })

    it('calls authenticate as normal user and restricts access to the whitelist', async () => {

    })

    it('calls authencticate as admin user and grants access to the transaction actions', async () => {

    })

    it('calls authenticate as admin user and grants access to the whitelist actions', async () => {

    })
})