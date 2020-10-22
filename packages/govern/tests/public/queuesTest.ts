import { getConfiguration } from '../../public/configure'
import QueuesAction from '../../internal/actions/QueuesAction'
import queues from '../../public/queues'

// Mocks
jest.mock('../../internal/actions/QueuesAction')

/**
 * queues test
 */
describe('queues Test', () => {
  const queuesActionMock = QueuesAction as jest.MockedClass<typeof QueuesAction>

  it('queues test', async () => {
    await queues()

    expect(QueuesAction).toHaveBeenNthCalledWith(1, getConfiguration())

    expect(queuesActionMock.mock.instances[0].execute).toHaveBeenCalledTimes(1)
  })
})