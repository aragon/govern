import Database from '../../../src/db/Database';
import Whitelist from '../../../src/db/Whitelist';

// Mocks
jest.mock('../../../src/db/Database')

/**
 * Whitelist test
 */
describe('WhitelistTest', () => {
    let whitelist: Whitelist,
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

        whitelist = new Whitelist(databaseMock);
    })

    it('calls getList and returns the expected value', async () => {
        (databaseMock.query as jest.MockedFunction<typeof databaseMock.query>).mockReturnValueOnce(Promise.resolve(true))

        await expect(whitelist.getList()).resolves.toEqual(true)

        expect(databaseMock.query).toHaveBeenNthCalledWith(1, 'SELECT * FROM whitelist')
    })

    it('calls getList and throws as expected', async () => {
        (databaseMock.query as jest.MockedFunction<typeof databaseMock.query>).mockReturnValueOnce(Promise.reject('NOPE'))

        await expect(whitelist.getList()).rejects.toEqual('NOPE')

        expect(databaseMock.query).toHaveBeenNthCalledWith(1, 'SELECT * FROM whitelist')
    })

    it('calls keyExists and returns true', async () => {
        (databaseMock.query as jest.MockedFunction<typeof databaseMock.query>).mockReturnValueOnce(Promise.resolve([0]))

        await expect(whitelist.keyExists('0x00')).resolves.toEqual(true)

        expect(databaseMock.query).toHaveBeenNthCalledWith(1, `SELECT * FROM whitelist WHERE PublicKey='0x00'`)
    })

    it('calls keyExists and returns false', async () => {
        (databaseMock.query as jest.MockedFunction<typeof databaseMock.query>).mockReturnValueOnce(Promise.resolve([]))

        await expect(whitelist.keyExists('0x00')).resolves.toEqual(false)

        expect(databaseMock.query).toHaveBeenNthCalledWith(1, `SELECT * FROM whitelist WHERE PublicKey='0x00'`)
    })

    it('calls keyExists and throws as expected', async () => {
        (databaseMock.query as jest.MockedFunction<typeof databaseMock.query>).mockReturnValueOnce(Promise.reject('NOPE'))

        await expect(whitelist.keyExists('0x00')).rejects.toEqual('NOPE')

        expect(databaseMock.query).toHaveBeenNthCalledWith(1, `SELECT * FROM whitelist WHERE PublicKey='0x00'`)
    })

    it('calls getItemByKey and returns the expected value', async () => {
        (databaseMock.query as jest.MockedFunction<typeof databaseMock.query>).mockReturnValueOnce(Promise.resolve(true))

        await expect(whitelist.getItemByKey('0x00')).resolves.toEqual(true)

        expect(databaseMock.query).toHaveBeenNthCalledWith(1, `SELECT * FROM whitelist WHERE PublicKey='0x00'`)
    })

    it('calls getItemByKey and throws as expected', async () => {
        (databaseMock.query as jest.MockedFunction<typeof databaseMock.query>).mockReturnValueOnce(Promise.reject('NOPE'))

        await expect(whitelist.getItemByKey('0x00')).rejects.toEqual('NOPE')

        expect(databaseMock.query).toHaveBeenNthCalledWith(1, `SELECT * FROM whitelist WHERE PublicKey='0x00'`)
    })

    it('calls addItem and returns the expected value', async () => {
        (databaseMock.query as jest.MockedFunction<typeof databaseMock.query>).mockReturnValueOnce(Promise.resolve(true))

        await expect(whitelist.addItem('0x00', 0)).resolves.toEqual(true)

        expect(databaseMock.query).toHaveBeenNthCalledWith(1, `INSERT INTO whitelist VALUES (0x00, 0)`)
    })

    it('calls addItem and throws as expected', async () => {
        (databaseMock.query as jest.MockedFunction<typeof databaseMock.query>).mockReturnValueOnce(Promise.reject('NOPE'))

        await expect(whitelist.addItem('0x00', 0)).rejects.toEqual('NOPE')

        expect(databaseMock.query).toHaveBeenNthCalledWith(1, `INSERT INTO whitelist VALUES (0x00, 0)`)
    })

    it('calls deleteItem and returns true', async () => {
        (databaseMock.query as jest.MockedFunction<typeof databaseMock.query>).mockReturnValueOnce(Promise.resolve([0]))

        await expect(whitelist.deleteItem('0x00')).resolves.toEqual(true)

        expect(databaseMock.query).toHaveBeenNthCalledWith(1, `DELETE FROM whitelist WHERE PublicKey='0x00'`)
    })

    it('calls deleteItem and returns false', async () => {
        (databaseMock.query as jest.MockedFunction<typeof databaseMock.query>).mockReturnValueOnce(Promise.resolve([]))
        
        await expect(whitelist.deleteItem('0x00')).resolves.toEqual(false)

        expect(databaseMock.query).toHaveBeenNthCalledWith(1, `DELETE FROM whitelist WHERE PublicKey='0x00'`)
    })

    it('calls deleteItem and throws as expected', async () => {
        (databaseMock.query as jest.MockedFunction<typeof databaseMock.query>).mockReturnValueOnce(Promise.reject('NOPE'))

        await expect(whitelist.deleteItem('0x00')).rejects.toEqual('NOPE')

        expect(databaseMock.query).toHaveBeenNthCalledWith(1, `DELETE FROM whitelist WHERE PublicKey='0x00'`)
    })
})
