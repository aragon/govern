import { isAddress } from '@ethersproject/address';
import Database from '../../../src/db/Database';
import Whitelist, { ListItem } from '../../../src/db/Whitelist';
import GetListAction from '../../../src/whitelist/GetListAction';

// Mocks
jest.mock('../../../src/db/Whitelist')
jest.mock('@ethersproject/address')

/**
 * GetListAction test
 */
describe('GetListActionTest', () => {
    let getListAction: GetListAction,
    whitelistMock: Whitelist

    beforeEach(() => {
        new Whitelist({} as Database)
        whitelistMock = (Whitelist as jest.MockedClass<typeof Whitelist>).mock.instances[0]
    })

    it('calls execute and returns the expected result', async () => {
        (isAddress as jest.MockedFunction<typeof isAddress>).mockReturnValueOnce(true);

        (whitelistMock.getList as jest.MockedFunction<typeof whitelistMock.getList>).mockReturnValueOnce(Promise.resolve([{}] as ListItem[]));
        
        getListAction = new GetListAction(whitelistMock, {} as any)
        
        await expect(getListAction.execute()).resolves.toEqual([{}])

        expect(whitelistMock.getList).toHaveBeenNthCalledWith(1)
    })

    it('calls execute and throws as expected', async () => {
        (isAddress as jest.MockedFunction<typeof isAddress>).mockReturnValueOnce(true);

        (whitelistMock.getList as jest.MockedFunction<typeof whitelistMock.getList>).mockReturnValueOnce(Promise.reject('NOPE'));
        
        getListAction = new GetListAction(whitelistMock, {} as any)
        
        await expect(getListAction.execute()).rejects.toEqual('NOPE')

        expect(whitelistMock.getList).toHaveBeenNthCalledWith(1)
    })
})
