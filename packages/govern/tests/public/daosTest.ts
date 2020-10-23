import Configuration from '../../internal/configuration/Configuration'
import DAOSAction from '../../internal/actions/DAOSAction'
import daos from '../../public/daos'

// Mocks
jest.mock('../../internal/actions/DAOSAction')

/**
 * daos test
 */
describe('daos Test', () => {
  const daosActionMock = DAOSAction as jest.MockedClass<typeof DAOSAction>

  it('daos test', async () => {
    await daos()

    expect(DAOSAction).toHaveBeenNthCalledWith(1, Configuration.get())

    expect(daosActionMock.mock.instances[0].execute).toHaveBeenCalledTimes(1)
  })
})