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

    it('calls isAdmin and returns true', () => {

    })

    it('calls isAdmin and returns false', () => {

    })

    it('calls addAdmin and returns the added record', () => {

    })

    it('calls addAdmin and throws as expected', () => {

    })

    it('calls deleteAdmin and returns true', () => {

    })

    it('calls deleteAdmin and returns false', () => {

    })

    it('calls deleteAdmin and throws as expected', () => {

    })

    it('calls getAdmins and returns the expected list of admin records', () => {

    })

    it('calls getAdmins and throws as expected', () => {
        
    })
})