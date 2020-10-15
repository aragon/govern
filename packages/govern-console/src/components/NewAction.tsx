import React, { useCallback, useState } from 'react'
import 'styled-components/macro'
import abiCoder from 'web3-eth-abi'
import { useWallet } from 'use-wallet'
import { useContract } from '../lib/web3-contracts'
import queueAbi from '../lib/abi/OptimisticQueue.json'

type NewActionProps = {
  config: any
  executorAddress: string
  queueAddress: string
}

type Input = {
  name: string | undefined
  type: string | undefined
}

type ContractCallHandlerProps = {
  constant: boolean
  contractAddress: string
  queueContract: any
  name: string
  inputs: Input[] | any[]
  rawAbiItem: AbiType
  executor: string
  config: any
}

type AbiType = {
  constant: boolean,
  inputs: Input
  payable: string,
  stateMutability: string,
  type: string
}

function encodeSchedule(
  nonce: string,
  submitter: string,
  executor: string,
  actions: any,
  config: any
): String {
  const scheduleAbi = queueAbi.find((abiItem: any) => abiItem.type === 'function' && abiItem.name === 'schedule')
  // @ts-ignore
  return abiCoder.encodeParameter(scheduleAbi.inputs[0], {
    payload: {
      nonce,
      executionTime: config.executionDelay,
      submitter,
      executor,
      actions,
      proof: '0x00'
    },
    config: {
      executionDelay: config.executionDelay,
      scheduleDeposit: {
        token: config.scheduleDeposit.token,
        amount: config.scheduleDeposit.amount
      },
      challengeDeposit: {
        token: config.challengeDeposit.token,
        amount: config.challengeDeposit.amount
      },
      vetoDeposit: {
        token: config.vetoDeposit.token,
        amount: config.vetoDeposit.amount
      },
      resolver: config.resolver,
      rules: config.rules
    }
  })
}

export default function NewAction({ config, executorAddress, queueAddress }: NewActionProps) {
  const [abi, setAbi] = useState('')
  const [parsedAbi, setParsedAbi] = useState([])
  const [contractAddress, setContractAddress] = useState('')
  const queueContract = useContract(queueAddress, queueAbi)
  // @ts-ignore

  const handleParseAbi = useCallback(e => {
    e.preventDefault()
    try {
      const parsedAbi = JSON.parse(abi)
      setParsedAbi(parsedAbi)
    } catch (err) {
      console.error('there seems to be an error in the ABI.')
    }
  }, [abi])
  
  return (
    <>
    <h2 css={`
      margin-top: ${2 * 8}px;
    `}>New action</h2>
    <div
      css={`
        padding: 8px;
        margin-top: ${4 * 8}px;
        border: 1px solid whitesmoke;
        h2 {
          font-weight: bold;
          font-size: 24px;
        }
        h3 {
          font-weight: bold;
          font-size: 18px;
        }
        p {
          margin-bottom: 16px;
          margin-top: 16px;
        }
      `}
    >
      <form
        css={`
          padding: 8px;
          margin-top: ${4 * 8}px;
          border: 1px solid whitesmoke;
        `}
      >
        <label>
          Input function ABI
          <input
            type="input"
            onChange={e => setAbi(e.target.value)}
            placeholder="0xbeef..."
            value={abi}
            css={`
              margin-top: 12px;
              width: 100%;
              color: black;
            `}
          />
        </label>
        <label>
          Input contract address
          <input
            type="input"
            onChange={e => setContractAddress(e.target.value)}
            placeholder="0xbeef..."
            value={contractAddress}
            css={`
              margin-top: 12px;
              width: 100%;
              color: black;
            `}
          />
        </label>
        <button
          onClick={handleParseAbi}
          css={`
            margin-top: 16px;
            font-family: 'Overpass Mono', monospace;
            font-size: 12px;
            position: relative;
            background: transparent;
            color: white;
            cursor: pointer;

            &:active {
              top: 1px;
            }
          `}
        >
         Parse ABI 
        </button>
      </form>
        {abi &&
          parsedAbi!.map(
            (abiItem: any) =>
              abiItem?.type === 'function' && (
                <div
                  key={abiItem.name}
                  css={`
                    padding: 8px;
                    margin-top: 8px;
                    border: 1px solid whitesmoke;
                  `}
                >
                  <ContractCallHandler
                    constant={abiItem.constant!}
                    contractAddress={contractAddress}
                    queueContract={queueContract}
                    name={abiItem.name}
                    inputs={abiItem.inputs}
                    rawAbiItem={abiItem}
                    executor={executorAddress}
                    config={config}
                  />
                </div>
              ),
          )}
    </div>
    </>
  )
}

function ContractCallHandler({
  constant,
  queueContract,
  name,
  inputs,
  rawAbiItem,
  executor,
  contractAddress,
  config
}: ContractCallHandlerProps) {
  const [result, setResult] = useState('')
  const [values, setValues] = useState(() => {
    if (inputs.length === 0) {
      return null
    }
    // @ts-ignore
    // Sorry but I got very tired of fighting with types
    return inputs.map((input: any) => ({
      name: input.name,
      type: input.type,
      value: '',
    }))
  })

  const { account } = useWallet()

  const updateValue = useCallback(
    (name, updatedValue) => {
      if (values) {
        setValues((elements: any) =>
          elements.map((element: any) =>
            element.name === name
              ? { ...element, value: updatedValue }
              : element,
          ),
        )
      }
    },
    [values],
  )

  const handleExecute = useCallback(
    async e => {
      e.preventDefault()
      try {
        const functionValues = values ? values.map((val: any) => val.value) : []

        // @ts-ignore
        const encodedFunctionCall = abiCoder.encodeFunctionCall(rawAbiItem, functionValues)

        const nonce = await queueContract.nonce()
        const action = encodeSchedule(nonce, account!, executor, [{
          to: contractAddress,
          value: "0x00",
          data: encodedFunctionCall
        }], config)

        const root = await queueContract.ROOT_ROLE()

        const tx = await queueContract["schedule"](action, {
          value: "0",
          gasLimit: "500000"
        })
        console.log(tx)
        setResult(tx.hash)

      } catch (e) {
        console.error(e)
      }
    },
    [account, config, executor, rawAbiItem, contractAddress, queueContract, values],
  )

  return (
    <>
      <h3>{name}</h3>
      <form
        css={`
          display: flex;
          flex-direction: column;
          max-width: 600px;
        `}
      >
        {values?.map((value: any, i: number) => (
          <div key={value.name}>
            <label>
              {value.name}
              <input
                value={values[i].value}
                onChange={e => updateValue(value.name, e.target.value)}
                css={`
                  margin-top: 12px;
                `}
              />
            </label>
          </div>
        ))}
        <button
          type="submit"
          onClick={handleExecute}
          css={`
            max-width: 100px;
            margin-top: 16px;
            font-family: 'Overpass Mono', monospace;
            font-size: 12px;
            position: relative;
            background: transparent;
            color: white;
            cursor: pointer;

            &:active {
              top: 1px;
            }
          `}
        >
          Execute
        </button>
        <span>Result: {result}</span>
      </form>
    </>
  )
}
