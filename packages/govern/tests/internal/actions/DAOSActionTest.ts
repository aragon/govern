import DAOSAction from '../../../internal/actions/DAOSAction'

// Mocks
jest.mock('graphql-tag');

/**
 * DAOSAction test
 */
describe('DAOSActionTest', () => {
  it('calls the constructor and initiates the class as expected', () => {
    new DAOSAction()
  })
})