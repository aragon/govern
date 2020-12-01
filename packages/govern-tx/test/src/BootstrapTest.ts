import { FastifyInstance } from 'fastify';

import Configuration from '../../src/config/Configuration';
import Provider from '../../src/provider/Provider';
import Wallet from '../../src/wallet/Wallet';

import Database from '../../src/db/Database';
import Whitelist from '../../src/db/Whitelist';
import Admin from '../../src/db/Admin';

import Authenticator from '../../src/auth/Authenticator';

import ExecuteTransaction from '../../src/transactions/execute/ExecuteTransaction';
import ChallengeTransaction from '../../src/transactions/challenge/ChallengeTransaction';
import ScheduleTransaction from '../../src/transactions/schedule/ScheduleTransaction';

import AddItemAction from '../../src/whitelist/AddItemAction';
import DeleteItemAction from '../../src/whitelist/DeleteItemAction';
import GetListAction from '../../src/whitelist/GetListAction';

import Bootstrap from '../../src/Bootstrap';

//Mocks
jest.mock('fastify')

jest.mock('../../src/config/Configuration')
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
    let bootstrap,
    fastifyMock: FastifyInstance,
    configurationMock: Configuration,
    providerMock: Provider,
    walletMock: Wallet,
    databaseMock: Database,
    whitelistMock: Whitelist,
    adminMock: Admin,
    authenticatorMock: Authenticator,
    executeTransactionMock: ExecuteTransaction,
    challengeTransactionMock: ChallengeTransaction,
    scheduleTransactionMock: ScheduleTransaction,
    addItemActionMock: AddItemAction,
    deleteItemActionMock: DeleteItemAction,
    getListActionMock: GetListAction;

  beforeEach(() => {
    bootstrap = new Bootstrap({...})
  })

  it('calls the constructor and initiates the class as expected', async () => {
   
  })

  it('calls the constructor and throws a error', async () => {

  })

  it('calls run and starts the server as expected on the configured port', async () => {

  })

  it('calls run and does log the error as expected', async () => {

  })
})
