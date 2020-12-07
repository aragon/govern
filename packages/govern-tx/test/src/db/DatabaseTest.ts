import postgres = require('postgres');
import Database from '../../../src/db/Database';

const config = {
    host: 'host',
    port: 100,
    database: 'database',
    user: 'user',
    password: 'password'
}    

// Mocks
const postgressMockFunc = jest.fn()

jest.mock('postgres', () => {
    return (options: any) => {
        expect(options).toEqual({
            host: 'host',
            port: 100,
            database: 'database',
            username: 'user',
            password: 'password'
        })

        return postgressMockFunc
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

    it('calls the constructor and establishes the connection as expected', () => {
        //@ts-ignore
        expect(database.sql).toEqual(postgressMockFunc)
    })

    it('calls query and calls the postgres sql function as expected', () => {
        database.query('ASDF')

        //@ts-ignore
        expect(database.sql).toHaveBeenNthCalledWith(1, 'ASDF')
    })
})