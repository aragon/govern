import QueueAction from '../../internal/actions/QueueAction'
import { queue } from '../../public/queue'

// Mocks
jest.mock('../../internal/actions/QueueAction')

/**
 * queue test
 */
describe('queue Test', () => {
  const queueActionMock = QueueAction as jest.MockedClass<typeof QueueAction>

  it('calls queue and returns as expected', async () => {
    await queue('ID')

    expect(QueueAction).toHaveBeenNthCalledWith(1, { id: 'ID' })

    expect(queueActionMock.mock.instances[0].execute).toHaveBeenCalledTimes(1)
  })
})
