import React, { useCallback, useState } from 'react'
import BN from 'bn.js'
import { useWallet } from 'use-wallet'
import abiCoder from 'web3-eth-abi'
import { toHex } from 'web3-utils'
import 'styled-components/macro'
import Button from './Button'
import { useContract } from '../lib/web3-contracts'
import queueAbi from '../lib/abi/OptimisticQueue.json'

const EMPTY_BYTES = '0x00'

type Input = {
  name: string | undefined
  type: string | undefined
}

type AbiType = {
  inputs: Input
  payable: string
  stateMutability: string
  type: string
}

type NewActionProps = {
  config: any
  executorAddress: string
  queueAddress: string
}

export default function NewAction({
  config,
  executorAddress,
  queueAddress,
}: NewActionProps) {
  const [abi, setAbi] = useState('')
  const [contractAddress, setContractAddress] = useState('')
  const [parsedAbi, setParsedAbi] = useState([])
  const [proof, setProof] = useState('')
  const queueContract = useContract(queueAddress, queueAbi)

  const handleParseAbi = useCallback(
    e => {
      e.preventDefault()
      try {
        const parsedAbi = JSON.parse(abi)
        setParsedAbi(parsedAbi)
      } catch (err) {
        console.error('there seems to be an error in the ABI.')
      }
    },
    [abi],
  )

  return (
    <>
      <h2
        css={`
          margin-top: 16px;
        `}
      >
        New action
      </h2>
      <div
        css={`
          padding: 8px;
          margin-top: 32px;
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
            margin-top: 32px;
            border: 1px solid whitesmoke;
          `}
        >
          <label>
            Input function ABI
            <input
              type="input"
              onChange={e => setAbi(e.target.value)}
              placeholder="[{}]"
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
          <label>
            Input action justification
            <input
              type="input"
              onChange={e => setProof(e.target.value)}
              placeholder="Qmw"
              value={proof}
              css={`
                margin-top: 12px;
                width: 100%;
                color: black;
              `}
            />
          </label>
          <Button onClick={handleParseAbi}>Parse ABI</Button>
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
                    config={config}
                    contractAddress={contractAddress}
                    executor={executorAddress}
                    inputs={abiItem.inputs}
                    name={abiItem.name}
                    proof={proof}
                    queueContract={queueContract}
                    rawAbiItem={abiItem}
                  />
                </div>
              ),
          )}
      </div>
    </>
  )
}

type ContractCallHandlerProps = {
  contractAddress: string
  config: any
  executor: string
  inputs: Input[] | any[]
  name: string
  proof: string
  queueContract: any
  rawAbiItem: AbiType
}

function ContractCallHandler({
  config,
  contractAddress,
  executor,
  inputs,
  name,
  proof,
  queueContract,
  rawAbiItem,
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
        const encodedFunctionCall = abiCoder.encodeFunctionCall(
          rawAbiItem,
          functionValues,
        )

        const nonce = await queueContract.nonce()
        const bnNonce = new BN(nonce.toString())
        const newNonce = bnNonce.add(new BN('1'))

        // Right now + 120 seconds into the future (in the future, this should be configurable)
        const currentDate = Math.round(Date.now() / 1000) + 120

        const tx = await queueContract['schedule'](
          {
            payload: {
              nonce: newNonce.toString(),
              executionTime: currentDate,
              submitter: account,
              executor,
              actions: [
                {
                  to: contractAddress,
                  value: EMPTY_BYTES,
                  data: encodedFunctionCall,
                },
              ],
              proof: proof ? toHex(proof) : EMPTY_BYTES,
            },
            config: {
              executionDelay: config.executionDelay,
              scheduleDeposit: {
                token: config.scheduleDeposit.token.id,
                amount: config.scheduleDeposit.amount,
              },
              challengeDeposit: {
                token: config.challengeDeposit.token.id,
                amount: config.challengeDeposit.amount,
              },
              vetoDeposit: {
                token: config.vetoDeposit.token.id,
                amount: config.vetoDeposit.amount,
              },
              resolver: config.resolver,
              rules: config.rules,
            },
          },
          {
            gasLimit: 500000,
          },
        )

        setResult(tx.hash)
      } catch (e) {
        console.error(e)
      }
    },
    [
      account,
      config,
      contractAddress,
      executor,
      proof,
      queueContract,
      rawAbiItem,
      values,
    ],
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
        <Button type="submit" onClick={handleExecute}>
          Execute
        </Button>
        <span>Result: {result}</span>
      </form>
    </>
  )
}
