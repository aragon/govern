import GamesAction from '../../internal/actions/GamesAction'
import games from '../../public/games'

// Mocks
jest.mock('../../internal/actions/GamesAction')
jest.mock('graphql-tag')

/**
 * games test
 */
describe('games Test', () => {
  const gamesActionMock = GamesAction as jest.MockedClass<typeof GamesAction>

  it('calls games and returns as expected', async () => {
    await games('0x00')

    expect(GamesAction).toHaveBeenNthCalledWith(1, { address: '0x00' })

    expect(gamesActionMock.mock.instances[0].execute).toHaveBeenCalledTimes(1)
  })
})