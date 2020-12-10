import AbstractAction, { Request } from '../../lib/AbstractAction';

class MockAction extends AbstractAction {
    public execute(): Promise<any> {
        return Promise.resolve(true)
    }
}

/**
 * AbstractAction test
 */
describe('AbstractAction Test', () => {
    let action: MockAction

    beforeEach(() => {
        action = new MockAction({message: true} as Request)
    })

    it('has the correct schema defined', () => {
        //@ts-ignore
        expect(AbstractAction.schema).toEqual({
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

    it('has set the request property', () => {
        //@ts-ignore
        expect(action.request).toEqual({message: true})
    })
})
