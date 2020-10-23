import Configuration from '../../internal/configuration/Configuration'
import DAOAction from '../../internal/actions/DAOAction'
import dao from '../../public/dao'

// Mocks
jest.mock('../../internal/actions/DAOAction')

/**
 * dao test
 */
describe('dao Test', () => {
  const daoActionMock = DAOAction as jest.MockedClass<typeof DAOAction>

  it('dao test', async () => {
    await dao('0x00')

    expect(DAOAction).toHaveBeenNthCalledWith(1, Configuration.get(), { address: '0x00' })

    expect(daoActionMock.mock.instances[0].execute).toHaveBeenCalledTimes(1)
  })
})