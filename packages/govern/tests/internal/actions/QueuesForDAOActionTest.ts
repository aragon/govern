import QueuesForDAOAction from '../../../internal/actions/QueuesForDAOAction'

// Mocks
jest.mock('graphql-tag');

/**
 * QueuesForDAOAction test
 */
describe('QueuesForDAOActionTest', () => {
  it('calls the constructor and initiates the class as expected', () => {
    new QueuesForDAOAction({address: '0x28c04471ce4f5d1f027ca5f69faa5678c6f87937'})
  })

  it('calls the constructor and throws the expected error', () => {
    expect(() => {
      new QueuesForDAOAction({address: '0x00'})
    }).toThrow('Invalid Ethereum address passed!')
  })
})