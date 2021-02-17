import Whitelist from '../../../src/db/Whitelist';
import AbstractWhitelistAction from '../../../lib/whitelist/AbstractWhitelistAction';
import WhiteListParams from '../../../lib/whitelist/AbstractWhitelistAction'

interface MockInterface {
    message: string | any
}


// Mocks
class MockAction extends AbstractWhitelistAction<MockInterface>{
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
                    txLimit: 0
                },
                signature: ''
            } as any,
        )
    })

    it('has the correct schema defined', () => {
        expect(AbstractWhitelistAction.schema).toEqual({
            body: {
                type: 'object',
                required: ['message', 'signature'],
                properties: {
                    message: {
                        oneOf: [
                          { type: 'string'},
                          { type: 'object'}
                        ]
                      },
                    signature: { type: 'string' }
                }
            }
        })
    })
})
