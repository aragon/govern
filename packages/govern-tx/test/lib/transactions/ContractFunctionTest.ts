import { defaultAbiCoder, Fragment, JsonFragment, FunctionFragment } from '@ethersproject/abi';
import { id } from '@ethersproject/hash'
import ContractFunction from '../../../lib/transactions/ContractFunction';

// Mocks
jest.mock('@ethersproject/abi')
jest.mock('@ethersproject/hash')

/**
 * ContractFunction test
 */
describe('ContractFunctionTest', () => {
    let contractFunction: ContractFunction,
    fragmentMock = {inputs: 'INPUTS', format: jest.fn()}

    beforeEach(() => {
        (defaultAbiCoder.decode as jest.MockedFunction<typeof defaultAbiCoder.decode>).mockReturnValueOnce(['ARGUMENT']);
        
        (Fragment.fromObject as jest.MockedFunction<typeof Fragment.fromObject>).mockReturnValueOnce(fragmentMock as any);

        contractFunction = new ContractFunction({} as JsonFragment, 'MESSAGE')

        expect(defaultAbiCoder.decode).toHaveBeenNthCalledWith(1, 'INPUTS', 'MESSAGE')

        expect(contractFunction.functionArguments).toEqual(['ARGUMENT'])
    })

    it('calls encode and returns the expected value', () => {
        (id as jest.MockedFunction<typeof id>).mockReturnValueOnce('0x0');

        (fragmentMock.format as jest.MockedFunction<typeof fragmentMock.format>).mockReturnValueOnce('SIGNATURE');

        (defaultAbiCoder.encode as jest.MockedFunction<typeof defaultAbiCoder.encode>).mockReturnValueOnce('0xENCODED');

        expect(contractFunction.encode()).toEqual('0x0ENCODED')

        expect(defaultAbiCoder.encode).toHaveBeenNthCalledWith(1, 'INPUTS', ['ARGUMENT'])

        expect(id).toHaveBeenNthCalledWith(1, 'SIGNATURE')
    })

    it('calls encode and throws as expected', () => {
        //@ts-ignore
        (defaultAbiCoder.encode as jest.MockedFunction<typeof defaultAbiCoder.encode>).mockImplementation(() => {throw 'NOPE'})

        expect(() => contractFunction.encode()).toThrow('NOPE')

        expect(defaultAbiCoder.encode).toHaveBeenNthCalledWith(1, 'INPUTS', ['ARGUMENT'])
    })

    it('calls decode and returns the expected value', () => {
        (defaultAbiCoder.decode as jest.MockedFunction<typeof defaultAbiCoder.decode>).mockReturnValueOnce(['DECODED']);
        
        expect(contractFunction.decode()).toEqual(['DECODED'])

        expect(defaultAbiCoder.decode).toHaveBeenNthCalledWith(1, 'INPUTS', 'MESSAGE')
    })

    it('calls decode and throws as expected', () => {
        //@ts-ignore
        (defaultAbiCoder.decode as jest.MockedFunction<typeof defaultAbiCoder.decode>).mockImplementation(() => {throw 'NOPE'})
        
        expect(() => contractFunction.decode()).toThrow('NOPE')

        expect(defaultAbiCoder.decode).toHaveBeenNthCalledWith(1, 'INPUTS', 'MESSAGE')
    })
})
