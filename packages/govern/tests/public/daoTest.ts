import DaoAction from '../../internal/actions/DAOAction'
import { dao} from '../../public/dao'

// Mocks
jest.mock('../../internal/actions/DaoAction')

/**
 * dao test
 */
describe('dao Test', () => {
  const daoActionMock = DaoAction as jest.MockedClass<typeof DaoAction>

  it('calls dao and executes as expected', async () => {
    await dao('0x00')

    expect(DaoAction).toHaveBeenNthCalledWith(1, { address: '0x00' })

    expect(daoActionMock.mock.instances[0].execute).toHaveBeenCalledTimes(1)
  })
})
