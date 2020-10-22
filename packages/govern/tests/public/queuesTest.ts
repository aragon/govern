import QueuesAction from '../../internal/actions/QueuesAction'
import configuration from '../../public/configuration'
import queues from '../../public/queues'

// Mocks
jest.mock('../../internal/actions/QueuesAction')

/**
 * queues test
 */
describe('queues Test', () => {
  const queuesActionMock = QueuesAction as jest.MockedClass<typeof QueuesAction>

  it('queues test', async () => {
    configuration.global = true;

    await queues()

    expect(QueuesAction).toHaveBeenNthCalledWith(1, configuration.global)

    expect(queuesActionMock.mock.instances[0].execute).toHaveBeenCalledTimes(1)
  })
})