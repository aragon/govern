import DAOSAction from '../../internal/actions/DAOSAction'
import daos from '../../public/daos'

// Mocks
jest.mock('../../internal/actions/DAOSAction')
jest.mock('graphql-tag')

/**
 * daos test
 */
describe('daos Test', () => {
  const daosActionMock = DAOSAction as jest.MockedClass<typeof DAOSAction>

  it('calls daos and returns as expected', async () => {
    await daos()

    expect(DAOSAction).toHaveBeenCalledTimes(1)

    expect(daosActionMock.mock.instances[0].execute).toHaveBeenCalledTimes(1)
  })
})