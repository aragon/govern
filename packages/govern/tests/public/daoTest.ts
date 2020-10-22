import dao from '../../public/dao';

// Mocks
jest.mock('../../internal/actions/DAOAction');

/**
 * dao test
 */
describe('dao Test', () => {
  let daoAction;

  beforeEach(() => {
    new DAOAction();
    daoAction = DAOAction.mock.instances[0];
  });

  it('dao test', () => {
    dao('0x00');
  });
});