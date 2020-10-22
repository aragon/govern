import QueueAction from '../../internal/actions/QueueAction'
import configuration from '../../public/configuration'
import queue from '../../public/queue'

// Mocks
jest.mock('../../internal/actions/QueueAction')

/**
 * queues test
 */
describe('queue Test', () => {
  const queueActionMock = QueueAction as jest.MockedClass<typeof QueueAction>

  it('queue test', async () => {
    configuration.global = true;

    await queue('0x00')

    expect(QueueAction).toHaveBeenNthCalledWith(1, configuration.global, { address: '0x00' })

    expect(queueActionMock.mock.instances[0].execute).toHaveBeenCalledTimes(1)
  })
})