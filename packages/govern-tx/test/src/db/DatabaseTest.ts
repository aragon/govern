import Database from '../../../src/db/Database';

const config = {
    host: 'host',
    port: 100,
    database: 'database',
    user: 'user',
    password: 'password'
}    

// Mocks
jest.mock('postgres', () => {
    return (options: any) => {
        expect(options).toEqual({
            host: 'host',
            port: 100,
            database: 'database',
            username: 'user',
            password: 'password'
        })

        return jest.fn(() => Promise.resolve('EXECUTED'))
    }
})

/**
 * Database test
 */
describe('DatabaseTest', () => {
    let database: Database;

    beforeEach(() => {
        database = new Database(config)
    })

    it('calls query and calls the postgres sql function as expected', async () => {
        expect(await database.query('ASDF')).toEqual('EXECUTED')
    })
})
