import DaosAction from '../../../internal/actions/DAOSAction'

// Mocks
jest.mock('graphql-tag');

/**
 * DaosAction test
 */
describe('DAOSActionTest', () => {
  it('calls the constructor and initiates the class as expected', () => {
    new DaosAction()
  })
})
