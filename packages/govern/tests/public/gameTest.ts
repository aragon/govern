import GameAction from '../../internal/actions/GameAction'
import configuration from '../../public/configuration'
import game from '../../public/game'

// Mocks
jest.mock('../../internal/actions/GameAction')

/**
 * game test
 */
describe('game Test', () => {
  const gameActionMock = GameAction as jest.MockedClass<typeof GameAction>

  it('game test', async () => {
    configuration.global = true

    await game('name')

    expect(GameAction).toHaveBeenNthCalledWith(1, configuration.global, { name: 'name' })

    expect(gameActionMock.mock.instances[0].execute).toHaveBeenCalledTimes(1)
  })
})