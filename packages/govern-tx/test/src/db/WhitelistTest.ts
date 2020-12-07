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

    it('calls getList and returns the expected value', () => {

    })

    it('calls getList and throws as expected', () => {

    })

    it('calls keyExists and returns true', () => {

    })

    it('calls keyExists and returns false', () => {

    })

    it('calls keyExists and throws as expected', () => {

    })

    it('calls getItemByKey and returns the expected value', () => {

    })

    it('calls getItemByKey and throws as expected', () => {

    })

    it('calls addItem and returns the expected value', () => {

    })

    it('calls addItem and throws as expected', () => {

    })

    it('calls deleteItem and returns true', () => {

    })

    it('calls deleteItem and returns false', () => {

    })

    it('calls deleteItem and throws as expected', () => {
        
    })
})