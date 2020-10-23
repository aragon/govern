import Configuration from '../../internal/configuration/Configuration'
import QueueAction from '../../internal/actions/QueueAction'
import queue from '../../public/queue'

// Mocks
jest.mock('../../internal/actions/QueueAction')

/**
 * queue test
 */
describe('queue Test', () => {
  const queueActionMock = QueueAction as jest.MockedClass<typeof QueueAction>

  it('queue test', async () => {
    await queue('0x00')

    expect(QueueAction).toHaveBeenNthCalledWith(1, Configuration.get(), { address: '0x00' })

    expect(queueActionMock.mock.instances[0].execute).toHaveBeenCalledTimes(1)
  })
})