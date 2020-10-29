import GameAction from '../../../internal/actions/GameAction'

// Mocks
jest.mock('graphql-tag');

/**
 * GameAction test
 */
describe('GameActionTest', () => {
  it('calls the constructor and initiates the class as expected', () => {
    new GameAction()
  })
})
