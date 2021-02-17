import AbstractAction from '../../lib/AbstractAction';

interface MockInterface {
    message: string | any
}


class MockAction extends AbstractAction<MockInterface> {
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
        action = new MockAction({message: true} as any)
    })

    it('has the correct schema defined', () => {
        expect(AbstractAction.schema).toEqual({
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

    it('has set the request property', () => {
        //@ts-ignore
        expect(action.request).toEqual({message: true})
    })
})
