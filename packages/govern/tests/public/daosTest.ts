import DAOSAction from '../../internal/actions/DAOSAction'
import configuration from '../../public/configuration'
import daos from '../../public/daos'

// Mocks
jest.mock('../../internal/actions/DAOSAction')

/**
 * daos test
 */
describe('daos Test', () => {
  const daosActionMock = DAOSAction as jest.MockedClass<typeof DAOSAction>

  it('daos test', async () => {
    configuration.global = true;

    await daos()

    expect(DAOSAction).toHaveBeenNthCalledWith(1, configuration.global)

    expect(daosActionMock.mock.instances[0].execute).toHaveBeenCalledTimes(1)
  })
})