import QueueAction from '../../../internal/actions/QueueAction'

// Mocks
jest.mock('graphql-tag');

/**
 * QueueAction test
 */
describe('QueueActionTest', () => {
  it('calls the constructor and initiates the class as expected', () => {
    new QueueAction()
  })
})