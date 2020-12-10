import Whitelist from '../../../src/db/Whitelist';
import AbstractWhitelistAction from '../../../lib/whitelist/AbstractWhitelistAction';

// Mocks
class MockAction extends AbstractWhitelistAction {
    public execute(): Promise<any> {
        return Promise.resolve(true)
    }
}

/**
 * AbstractWhitelistAction test
 */
describe('AbstractWhitelistAction Test', () => {
    let action: MockAction

    beforeEach(() => {
        action = new MockAction(
            {} as Whitelist,
            {
                message: {
                    publicKey: '0x00',
                    rateLimit: 0
                },
                signature: ''
            }
        )
    })

    it('has the correct schema defined', () => {
        expect(AbstractWhitelistAction.schema).toEqual({
            body: {
                type: 'object',
                required: ['message', 'signature'],
                properties: {
                    message: { type: 'string' },
                    signature: { type: 'string' }
                }
            }
        })
    })
})
