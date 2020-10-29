import DaosAction from '../../internal/actions/DAOSAction'
import { daos} from '../../public/daos'

// Mocks
jest.mock('../../internal/actions/DaosAction')
jest.mock('graphql-tag')

/**
 * daos test
 */
describe('daos Test', () => {
  const daosActionMock = DaosAction as jest.MockedClass<typeof DaosAction>

  it('calls daos and returns as expected', async () => {
    await daos()

    expect(DaosAction).toHaveBeenCalledTimes(1)

    expect(daosActionMock.mock.instances[0].execute).toHaveBeenCalledTimes(1)
  })
})
