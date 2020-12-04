//@ts-nocheck
import AbstractWhitelistAction from '../../lib/whitelist/AbstractWhitelistAction'
import AbstractTransaction from '../../lib/transactions/AbstractTransaction'

import Configuration from '../../src/config/Configuration'
import Provider from '../../src/provider/Provider'
import Wallet from '../../src/wallet/Wallet'

import Database from '../../src/db/Database'
import Whitelist from '../../src/db/Whitelist'
import Admin from '../../src/db/Admin'

import Authenticator from '../../src/auth/Authenticator'

import ExecuteTransaction from '../../src/transactions/execute/ExecuteTransaction';
import ChallengeTransaction from '../../src/transactions/challenge/ChallengeTransaction'
import ScheduleTransaction from '../../src/transactions/schedule/ScheduleTransaction'

import AddItemAction from '../../src/whitelist/AddItemAction';
import DeleteItemAction from '../../src/whitelist/DeleteItemAction';
import GetListAction from '../../src/whitelist/GetListAction';

import Bootstrap from '../../src/Bootstrap'

//Mocks
const fastifyMock: any = {
    post: jest.fn(),
    delete: jest.fn(),
    get: jest.fn(),
    addHook: jest.fn(),
    options: {}
}
jest.mock('fastify', () => {
    return {
        default: (options) => {
            fastifyMock.options = options

            return fastifyMock
        }
    }
})

jest.mock('../../src/provider/Provider')
jest.mock('../../src/wallet/Wallet')

jest.mock('../../src/db/Database')
jest.mock('../../src/db/Whitelist')
jest.mock('../../src/db/Admin')

jest.mock('../../src/auth/Authenticator')

jest.mock('../../src/transactions/execute/ExecuteTransaction')
jest.mock('../../src/transactions/challenge/ChallengeTransaction')
jest.mock('../../src/transactions/schedule/ScheduleTransaction')

jest.mock('../../src/whitelist/AddItemAction')
jest.mock('../../src/whitelist/DeleteItemAction')
jest.mock('../../src/whitelist/GetListAction')

/**
 * Bootstrap test
 */
describe('BootstrapTest', () => {
    let bootstrap: Bootstrap,
    executeTransactionMock: ExecuteTransaction,
    scheduleTransactionMock: ScheduleTransaction,
    challengeTransactionMock: ChallengeTransaction,
    addItemActionMock: AddItemAction,
    deleteItemActionMock: DeleteItemAction,
    getListActionMock: GetListAction

    const config = {
        ethereum: {
            publicKey: '0x00',
            contracts: {
                GovernQueue: '0x00'
            },
            url: 'localhost:8545',
            blockConfirmations: 42
        }, 
        database: {
            user: 'govern',
            host: 'localhost',
            password: 'dev',
            database: 'govern',
            port: 4000
        },
        server: {
            host: '0.0.0.0',
            port: 4040
        }
    }

  it('calls the constructor and initiates the class as expected', () => {
    fastifyMock.post = jest.fn((path, schemaObj, callback) => {
        switch(path) {
            case '/execute':
                expect(schemaObj).toEqual({schema: AbstractTransaction.schema})
                callback({params: true})
                executeTransactionMock = ExecuteTransaction.mock.instances[0]
                break
            case '/schedule':
                expect(schemaObj).toEqual({schema: AbstractTransaction.schema})
                callback({params: true})
                scheduleTransactionMock = ScheduleTransaction.mock.instances[0]
                break
            case '/challenge':
                expect(schemaObj).toEqual({schema: AbstractTransaction.schema})
                callback({params: true})
                challengeTransactionMock = ChallengeTransaction.mock.instances[0]
                break
            case '/whitelist':
                expect(schemaObj).toEqual({schema: AbstractWhitelistAction.schema})
                callback({params: true})
                addItemActionMock = AddItemAction.mock.instances[0]
                break
        }
    })

    fastifyMock.delete = jest.fn((path, schemaObj, callback) => {
        expect(path).toEqual('/whitelist')

        expect(schemaObj).toEqual({schema: AbstractWhitelistAction.schema})

        callback({params: true})

        deleteItemActionMock = DeleteItemAction.mock.instances[0]
    })
    
    fastifyMock.get = jest.fn((path, schemaObj, callback) => {
        expect(path).toEqual('/whitelist')

        expect(schemaObj).toEqual({schema: AbstractWhitelistAction.schema})

        callback({params: true})

        getListActionMock = GetListAction.mock.instances[0]
    })

    bootstrap = new Bootstrap(
        new Configuration(config)
    )

    /******************************************** 
     *  Expectations for all invoked constructors 
     ********************************************/
    expect(
        fastifyMock.options
    ).toEqual(
        {
            logger: {
                level: 'debug'
            }
        }
    )

    expect(bootstrap.server).toEqual(fastifyMock)

    expect(bootstrap.database).toBeInstanceOf(Database)
    
    expect(Database).toHaveBeenNthCalledWith(1, config.database)
    
    expect(bootstrap.provider).toBeInstanceOf(Provider)
    
    expect(Provider).toHaveBeenNthCalledWith(1, config.ethereum, Wallet.mock.instances[0])
    
    expect(Wallet).toHaveBeenNthCalledWith(1, Database.mock.instances[0])
    
    expect(bootstrap.whitelist).toBeInstanceOf(Whitelist)

    expect(Admin).toHaveBeenNthCalledWith(1, bootstrap.database)

    expect(bootstrap.authenticator).toBeInstanceOf(Authenticator)

    expect(Authenticator).toHaveBeenNthCalledWith(1, bootstrap.whitelist, Admin.mock.instances[0])

    /*********************************** 
     *  Expectations for added Auth Hook  
     ***********************************/
    expect(bootstrap.server.addHook).toHaveBeenNthCalledWith(
        1,
        'preHandler',
        expect.any(Function)
    )

    /************************************ 
     *  Expectations for all added routes 
     ************************************/
    expect(ExecuteTransaction).toHaveBeenNthCalledWith(1, config.ethereum, Provider.mock.instances[0], true)
    expect(executeTransactionMock.execute).toHaveBeenCalledTimes(1)

    expect(ScheduleTransaction).toHaveBeenNthCalledWith(1, config.ethereum, Provider.mock.instances[0], true)
    expect(scheduleTransactionMock.execute).toHaveBeenCalledTimes(1)

    expect(ChallengeTransaction).toHaveBeenNthCalledWith(1, config.ethereum, Provider.mock.instances[0], true)
    expect(challengeTransactionMock.execute).toHaveBeenCalledTimes(1)

    expect(AddItemAction).toHaveBeenNthCalledWith(1, Whitelist.mock.instances[0], true)
    expect(addItemActionMock.execute).toHaveBeenCalledTimes(1)

    expect(DeleteItemAction).toHaveBeenNthCalledWith(1, Whitelist.mock.instances[0], true)
    expect(deleteItemActionMock.execute).toHaveBeenCalledTimes(1)

    expect(GetListAction).toHaveBeenNthCalledWith(1, Whitelist.mock.instances[0])
    expect(getListActionMock.execute).toHaveBeenCalledTimes(1)

    expect(fastifyMock.post).toHaveBeenCalledTimes(4)
    expect(fastifyMock.delete).toHaveBeenCalledTimes(1)
    expect(fastifyMock.get).toHaveBeenCalledTimes(1)
  })

  it('calls the constructor and uses the configured logging level for fastify', () => {
    config.server.logLevel = 'warn'

    bootstrap = new Bootstrap(
        new Configuration(config)
    )

    expect(
        fastifyMock.options
    ).toEqual(
        {
            logger: {
                level: 'warn'
            }
        }
    )
  })

  it('calls run and starts the server as expected on the configured port', (done) => {
    console.log = jest.fn();

    fastifyMock.listen = jest.fn((port, host, callback) => {
        expect(port).toEqual(config.server.port)
        expect(host).toEqual(config.server.host)

        callback(false, 'myAddress')

        expect(console.log).toHaveBeenNthCalledWith(1, `Server is listening at myAddress`)

        done()
    })

    bootstrap = new Bootstrap(
        new Configuration(config)
    )
    bootstrap.run()
  })

  it('calls run and does log the error as expected', (done) => {
    const realProcess = process
    console.error = jest.fn();
    process = {...realProcess, exit: jest.fn()}

    bootstrap.server.listen = jest.fn((port, host, callback) => {
        expect(port).toEqual(config.server.port)
        expect(host).toEqual(config.server.host)

        callback(true, null)

        expect(console.error).toHaveBeenNthCalledWith(1, true)

        expect(process.exit).toHaveBeenNthCalledWith(1, 0)

        done()
        process = realProcess
    })
    
    bootstrap = new Bootstrap(
        new Configuration(config)
    )
    bootstrap.run()
  })
})
