import Configuration from '../../internal/configuration/Configuration'
import QueuesForDaoAction from '../../internal/actions/QueuesForDaoAction'
import queuesForDao from '../../public/queuesForDao'

// Mocks
jest.mock('../../internal/actions/QueuesForDaoAction')

/**
 * queuesForDao test
 */
describe('queuesForDao Test', () => {
  const queuesForDaoActionMock = QueuesForDaoAction as jest.MockedClass<typeof QueuesForDaoAction>

  it('queuesForDao test', async () => {
    await queuesForDao('0x00')

    expect(QueuesForDaoAction).toHaveBeenNthCalledWith(1, Configuration.get(), { address: '0x00' })

    expect(queuesForDaoActionMock.mock.instances[0].execute).toHaveBeenCalledTimes(1)
  })
})