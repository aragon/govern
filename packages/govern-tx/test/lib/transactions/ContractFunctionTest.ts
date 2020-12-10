import { defaultAbiCoder, Fragment, JsonFragment } from '@ethersproject/abi';
import ContractFunction from '../../../lib/transactions/ContractFunction';

// Mocks
jest.mock('@ethersproject/abi')

/**
 * ContractFunction test
 */
describe('ContractFunctionTest', () => {
    let contractFunction: ContractFunction

    beforeEach(() => {
        (defaultAbiCoder.decode as jest.MockedFunction<typeof defaultAbiCoder.decode>).mockReturnValueOnce(['ARGUMENT']);
 
        (Fragment.fromObject as jest.MockedFunction<typeof Fragment.fromObject>).mockReturnValueOnce({inputs: 'INPUTS'} as any);

        contractFunction = new ContractFunction({} as JsonFragment, 'MESSAGE')

        expect(defaultAbiCoder.decode).toHaveBeenNthCalledWith(1, 'INPUTS', 'MESSAGE')

        expect(contractFunction.functionArguments).toEqual(['ARGUMENT'])
    })

    it('calls encode and returns the expected value', () => {
        (defaultAbiCoder.encode as jest.MockedFunction<typeof defaultAbiCoder.encode>).mockReturnValueOnce('ENCODED')

        expect(contractFunction.encode()).toEqual('ENCODED')

        expect(defaultAbiCoder.encode).toHaveBeenNthCalledWith(1, 'INPUTS', ['ARGUMENT'])
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
