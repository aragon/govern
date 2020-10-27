import QueuesForDaoAction from '../../internal/actions/QueuesForDaoAction'
import { queuesForDao } from '../../public/queuesForDao'

// Mocks
jest.mock('../../internal/actions/QueuesForDaoAction')
jest.mock('graphql-tag')

/**
 * queuesForDao test
 */
describe('queuesForDao Test', () => {
  const queuesForDaoActionMock = QueuesForDaoAction as jest.MockedClass<typeof QueuesForDaoAction>

  it('calls queuesForDao and returns as expected', async () => {
    await queuesForDao('0x00')

    expect(QueuesForDaoAction).toHaveBeenNthCalledWith(1, { address: '0x00' })

    expect(queuesForDaoActionMock.mock.instances[0].execute).toHaveBeenCalledTimes(1)
  })
})