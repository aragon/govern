import { getConfiguration } from '../../public/configure'
import GamesAction from '../../internal/actions/GamesAction'
import games from '../../public/games'

// Mocks
jest.mock('../../internal/actions/GamesAction')

/**
 * games test
 */
describe('games Test', () => {
  const gamesActionMock = GamesAction as jest.MockedClass<typeof GamesAction>

  it('games test', async () => {
    await games()

    expect(GamesAction).toHaveBeenNthCalledWith(1, getConfiguration())

    expect(gamesActionMock.mock.instances[0].execute).toHaveBeenCalledTimes(1)
  })
})