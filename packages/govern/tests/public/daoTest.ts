import DaoAction from '../../internal/actions/DaoAction'
import { dao } from '../../public/dao'

// Mocks
jest.mock('../../internal/actions/DaoAction')

/**
 * dao test
 */
describe('dao Test', () => {
  const daoActionMock = DaoAction as jest.MockedClass<typeof DaoAction>

  it('calls dao and executes as expected', async () => {
    await dao('myName')

    expect(DaoAction).toHaveBeenNthCalledWith(1, { name: 'myName' })

    expect(daoActionMock.mock.instances[0].execute).toHaveBeenCalledTimes(1)
  })
})
