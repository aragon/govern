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
jest.mock('@ethersproject/wallet')
jest.mock('@ethersproject/bytes')

/**
 * Authenticator test
 */
describe('AuthenticatorTest', () => {
    let authenticator: Authenticator,
    whitelistMock: Whitelist,
    whitelistMockClass = (Whitelist as jest.MockedClass<typeof Whitelist>),
    databaseMock: Database,
    adminMock: Admin,
    adminMockClass = (Admin as jest.MockedClass<typeof Admin>),
    request = {
        routerPath: '/execute',
        body: {
            signature: '0x00',
            message: '0x00'
        }
    };


    const NO_ALLOWED = new Unauthorized('Not allowed action!');

    beforeEach(() => {
        const verifyMock = verifyMessage as jest.MockedFunction<typeof verifyMessage>
        const arrayifyMock = arrayify as jest.MockedFunction<typeof arrayify>

        verifyMock.mockReturnValue('0x00')
        arrayifyMock.mockReturnValue(new Uint8Array(0x00))

        databaseMock = new Database({
            user: 'user',
            host: 'host',
            password: 'password',
            database: 'databaseName',
            port: 1000
        })

        new Whitelist(databaseMock)
        whitelistMock = whitelistMockClass.mock.instances[0]

        new Admin(databaseMock)
        adminMock = adminMockClass.mock.instances[0]

        authenticator = new Authenticator(whitelistMock, adminMock)
    })

    it('calls authenticate as normal user and grants access to the transaction actions', async () => {
        whitelistMock.keyExists = jest.fn((publicKey) => {
            expect(publicKey).toEqual('0x00')

            return Promise.resolve(true)
        })

        await authenticator.authenticate(request as FastifyRequest)

        expect(verifyMessage).toHaveBeenNthCalledWith(1, new Uint8Array(0x00), request.body.signature)

        expect(arrayify).toHaveBeenNthCalledWith(1, request.body.message)

        expect(whitelistMock.keyExists).toHaveBeenCalled()
    })

    it('calls authenticate as normal user and restricts access to the whitelist', async () => {
        adminMock.isAdmin = jest.fn((publicKey) => {
            expect(publicKey).toEqual('0x00')

            return Promise.resolve(false)
        })
        
        request.routerPath = '/whitelist'
        
        await expect(authenticator.authenticate(request as FastifyRequest)).rejects.toThrowError(NO_ALLOWED)

        expect(verifyMessage).toHaveBeenNthCalledWith(1, new Uint8Array(0x00), request.body.signature)

        expect(arrayify).toHaveBeenNthCalledWith(1, request.body.message)

        expect(adminMock.isAdmin).toHaveBeenCalled()
    })

    it('calls authencticate as admin user and grants access to the transaction actions', async () => {
        adminMock.isAdmin = jest.fn((publicKey) => {
            expect(publicKey).toEqual('0x00')

            return Promise.resolve(true)
        })

        whitelistMock.keyExists = jest.fn((publicKey) => {
            expect(publicKey).toEqual('0x00')

            return Promise.resolve(false)
        })

        request.routerPath = '/execute'

        await authenticator.authenticate(request as FastifyRequest)

        expect(verifyMessage).toHaveBeenNthCalledWith(1, new Uint8Array(0x00), request.body.signature)

        expect(arrayify).toHaveBeenNthCalledWith(1, request.body.message)

        expect(adminMock.isAdmin).toHaveBeenCalled()

        expect(whitelistMock.keyExists).toHaveBeenCalled()
    })

    it('calls authenticate as admin user and grants access to the whitelist actions', async () => {
        adminMock.isAdmin = jest.fn((publicKey) => {
            expect(publicKey).toEqual('0x00')

            return Promise.resolve(true)
        })

        request.routerPath = '/whitelist'

        await authenticator.authenticate(request as FastifyRequest)

        expect(verifyMessage).toHaveBeenNthCalledWith(1, new Uint8Array(0x00), request.body.signature)

        expect(arrayify).toHaveBeenNthCalledWith(1, request.body.message)

        expect(adminMock.isAdmin).toHaveBeenCalled()
    })
})