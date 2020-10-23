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

  it('games test', async () => {
    await games()

    expect(gamesActionMock.mock.instances[0].execute).toHaveBeenCalledTimes(1)
  })
})