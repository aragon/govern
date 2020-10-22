import { getConfiguration } from '../../public/configure'
import QueueAction from '../../internal/actions/QueueAction'
import queue from '../../public/queue'

// Mocks
jest.mock('../../internal/actions/QueueAction')

/**
 * queues test
 */
describe('queue Test', () => {
  const queueActionMock = QueueAction as jest.MockedClass<typeof QueueAction>

  it('queue test', async () => {
    await queue('0x00')

    expect(QueueAction).toHaveBeenNthCalledWith(1, getConfiguration(), { address: '0x00' })

    expect(queueActionMock.mock.instances[0].execute).toHaveBeenCalledTimes(1)
  })
})