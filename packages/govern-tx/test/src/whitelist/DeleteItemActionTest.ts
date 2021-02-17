import { isAddress } from '@ethersproject/address';
import Database from '../../../src/db/Database';
import Whitelist, { ListItem } from '../../../src/db/Whitelist';
import DeleteItemAction from '../../../src/whitelist/DeleteItemAction';

// Mocks
jest.mock('../../../src/db/Whitelist')
jest.mock('@ethersproject/address')

/**
 * DeleteItemAction test
 */
describe('DeleteItemActionTest', () => {
    let deleteItemAction: DeleteItemAction,
    whitelistMock: Whitelist

    const request = {
        body: {
            message: {
                publicKey: '0x00'
            },
            signature: ''
        }
    }

    beforeEach(() => {
        new Whitelist({} as Database)
        whitelistMock = (Whitelist as jest.MockedClass<typeof Whitelist>).mock.instances[0]
    })

    it('calls validateRequest and returns the expected values', () => {
        (isAddress as jest.MockedFunction<typeof isAddress>).mockReturnValueOnce(true)

        deleteItemAction = new DeleteItemAction(whitelistMock, request as any)

        expect(isAddress).toHaveBeenNthCalledWith(1, '0x00')
    })

    it('calls validateRequest and throws because of a invalid ethereum address', () => {
        (isAddress as jest.MockedFunction<typeof isAddress>).mockReturnValueOnce(false)

        expect(() => {
            deleteItemAction = new DeleteItemAction(whitelistMock, request as any)
        }).toThrow('Invalid public key passed!')

        expect(isAddress).toHaveBeenNthCalledWith(1, '0x00')
    })

    it('calls execute and returns the expected result', async () => {
        (isAddress as jest.MockedFunction<typeof isAddress>).mockReturnValueOnce(true);

        (whitelistMock.deleteItem as jest.MockedFunction<typeof whitelistMock.deleteItem>).mockReturnValueOnce(Promise.resolve(true));
        
        deleteItemAction = new DeleteItemAction(whitelistMock, request as any)
        
        await expect(deleteItemAction.execute()).resolves.toEqual(true)

        expect(whitelistMock.deleteItem).toHaveBeenNthCalledWith(1, '0x00')
    })

    it('calls execute and throws as expected', async () => {
        (isAddress as jest.MockedFunction<typeof isAddress>).mockReturnValueOnce(true);

        (whitelistMock.deleteItem as jest.MockedFunction<typeof whitelistMock.deleteItem>).mockReturnValueOnce(Promise.reject('NOPE'));
        
        deleteItemAction = new DeleteItemAction(whitelistMock, request as any)
        
        await expect(deleteItemAction.execute()).rejects.toEqual('NOPE')

        expect(whitelistMock.deleteItem).toHaveBeenNthCalledWith(1, '0x00')
    })
})
