import Database from '../../../src/db/Database';
import Admin from '../../../src/db/Admin';

// Mocks
jest.mock('../../../src/db/Database')

/**
 * Admin test
 */
describe('AdminTest', () => {
    let admin: Admin,
    databaseMock: Database;

    beforeEach(() => {
        new Database({
            host: 'host',
            port: 100,
            database: 'database',
            user: 'user',
            password: 'password'
        })
        databaseMock = (Database as jest.MockedClass<typeof Database>).mock.instances[0]

        admin = new Admin(databaseMock);
    })

    it('calls isAdmin and returns true', async () => {
        databaseMock.query = jest.fn((query) => {
            expect(query).toEqual(`SELECT * FROM admins WHERE PublicKey='0x00'`)

            return Promise.resolve([0])
        })

        await expect(admin.isAdmin('0x00')).resolves.toEqual(true)
    })

    it('calls isAdmin and returns false', async () => {
        databaseMock.query = jest.fn((query) => {
            expect(query).toEqual(`SELECT * FROM admins WHERE PublicKey='0x00'`)

            return Promise.resolve([])
        })

        await expect(admin.isAdmin('0x00')).resolves.toEqual(false)
    })

    it('calls isAdmin and throws as expected', async () => {
        databaseMock.query = jest.fn((query) => {
            expect(query).toEqual(`SELECT * FROM admins WHERE PublicKey='0x00'`)

            return Promise.reject('NOPE')
        })

        await expect(admin.isAdmin('0x00')).rejects.toEqual('NOPE')
    })

    it('calls addAdmin and returns the expected value', async () => {
        databaseMock.query = jest.fn((query) => {
            expect(query).toEqual(`INSERT INTO admins VALUES (0x00)`)

            return Promise.resolve(true)
        })

        await expect(admin.addAdmin('0x00')).resolves.toEqual(true)
    })

    it('calls addAdmin and throws as expected', async () => {
        databaseMock.query = jest.fn((query) => {
            expect(query).toEqual(`INSERT INTO admins VALUES (0x00)`)

            return Promise.reject('NOPE')
        })

        await expect(admin.addAdmin('0x00')).rejects.toEqual('NOPE')
    })

    it('calls deleteAdmin and returns true', async () => {
        databaseMock.query = jest.fn((query) => {
            expect(query).toEqual(`DELETE FROM admins WHERE PublicKey='0x00'`)

            return Promise.resolve([0])
        })

        await expect(admin.deleteAdmin('0x00')).resolves.toEqual(true)
    })

    it('calls deleteAdmin and returns false', async () => {
        databaseMock.query = jest.fn((query) => {
            expect(query).toEqual(`DELETE FROM admins WHERE PublicKey='0x00'`)

            return Promise.resolve([])
        })

        await expect(admin.deleteAdmin('0x00')).resolves.toEqual(false)
    })

    it('calls deleteAdmin and throws as expected', async () => {
        databaseMock.query = jest.fn((query) => {
            expect(query).toEqual(`DELETE FROM admins WHERE PublicKey='0x00'`)

            return Promise.reject('NOPE')
        })

        await expect(admin.deleteAdmin('0x00')).rejects.toEqual('NOPE')
    })

    it('calls getAdmins and returns the expected value', async () => {
        databaseMock.query = jest.fn((query) => {
            expect(query).toEqual('SELECT * from admins')

            return Promise.resolve(true)
        })

        await expect(admin.getAdmins()).resolves.toEqual(true)
    })

    it('calls getAdmins and throws as expected', async () => {
        databaseMock.query = jest.fn((query) => {
            expect(query).toEqual('SELECT * from admins')

            return Promise.reject('NOPE')
        })

        await expect(admin.getAdmins()).rejects.toEqual('NOPE')
    })
})