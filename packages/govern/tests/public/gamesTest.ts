import GamesAction from '../../internal/actions/GamesAction'
import configuration from '../../public/configuration'
import games from '../../public/games'

// Mocks
jest.mock('../../internal/actions/GamesAction')

/**
 * games test
 */
describe('games Test', () => {
  const gamesActionMock = GamesAction as jest.MockedClass<typeof GamesAction>

  it('games test', async () => {
    configuration.global = true;

    await games()

    expect(GamesAction).toHaveBeenNthCalledWith(1, configuration.global)

    expect(gamesActionMock.mock.instances[0].execute).toHaveBeenCalledTimes(1)
  })
})