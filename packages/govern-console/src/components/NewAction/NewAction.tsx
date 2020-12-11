import React, { useCallback, useMemo, useState } from 'react'
import { Contract as EthersContract } from 'ethers'
import { useWallet } from 'use-wallet'
import 'styled-components/macro'
import Button from '../Button'
import Frame from '../Frame/Frame'
import { sendAction, callContractFunction } from './handlers'
import { useContract } from '../../lib/web3-contracts'
import ercAbi from '../../lib/abi/erc20.json'
import queueAbi from '../../lib/abi/GovernQueue.json'

type Input = {
  name: string
  type: string
}

type AbiType = {
  name: string
  inputs: Input[]
  payable: string
  stateMutability: string
  type: string
}

function determineMemberType(
  memberMutabilityType: string,
): 'event' | 'fallback' | 'function' | 'view' {
  if (memberMutabilityType === 'view' || memberMutabilityType === 'pure') {
    return 'view'
  }

  if (memberMutabilityType === 'receive') {
    return 'fallback'
  }

  if (memberMutabilityType === 'event') {
    return 'event'
  }

  return 'function'
}

type NewActionData = {
  config: any
  executorAddress: string
  queueAddress: string
}

export default function NewAction({
  config,
  executorAddress,
  queueAddress,
}: NewActionData) {
  const [abi, setAbi] = useState('')
  const [contractAddress, setContractAddress] = useState('')
  const [parsedAbi, setParsedAbi] = useState([])
  const [proof, setProof] = useState('')
  const [executionResult, setExecutionResult] = useState('')
  const [type, setType] = useState('')

  const queueContract = useContract(queueAddress, queueAbi)
  const ercContract = useContract(config.scheduleDeposit.token, ercAbi)
  const targetContract = useContract(contractAddress, parsedAbi)

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

  const handleSetExecutionResult = useCallback(
    (result, message) => {
      if (result === 'confirmed') {
        setType('green')
        setExecutionResult(message)
      }
      if (result === 'info') {
        setType('cyan')
        setExecutionResult(message)
      }
      if (result === 'error') {
        setType('red')
        setExecutionResult(message)
      }
    },
    [setExecutionResult],
  )

  const abiFunctions = useMemo(
    () =>
      parsedAbi.filter(
        (abiItem: AbiType) =>
          abiItem.type === 'function' &&
          abiItem.stateMutability !== 'constructor' &&
          abiItem.stateMutability !== 'event' &&
          abiItem.stateMutability !== 'pure' &&
          abiItem.stateMutability !== 'receive' &&
          abiItem.stateMutability !== 'view',
      ),
    [parsedAbi],
  )

  const abiEvents = useMemo(
    () => parsedAbi.filter((abiItem: AbiType) => abiItem.type === 'event'),
    [parsedAbi],
  )

  const abiViewFunctions = useMemo(
    () =>
      parsedAbi.filter(
        (abiItem: AbiType) =>
          abiItem.type === 'function' &&
          (abiItem.stateMutability === 'pure' ||
            abiItem.stateMutability === 'view'),
      ),
    [parsedAbi],
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
      <Frame>
        {executionResult && (
          <div
            css={`
              padding: 8px;
              margin-top: 32px;
              margin-bottom: 32px;
              border: 1px solid ${type};
            `}
          >
            {executionResult}
          </div>
        )}
        <form
          css={`
            padding: 8px;
            margin-top: 32px;
            border: 2px solid rgba(255, 255, 255, 0.2);
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
                min-height: 43px;
                background: black;
                border: 2px solid white;
                color: white;
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
                min-height: 43px;
                background: black;
                border: 2px solid white;
                color: white;
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
                min-height: 43px;
                background: black;
                border: 2px solid white;
                color: white;
              `}
            />
          </label>
          <Button onClick={handleParseAbi}>Parse ABI</Button>
        </form>

        {parsedAbi.length && (
          <>
            <Frame>
              <h2> Functions </h2>
              {abiFunctions!.map((abiItem: AbiType) => (
                <Frame key={abiItem.name}>
                  <ContractCallHandler
                    config={config}
                    contractAddress={contractAddress}
                    ercContract={ercContract}
                    executor={executorAddress}
                    handleSetExecutionResult={handleSetExecutionResult}
                    inputs={abiItem.inputs}
                    memberType={determineMemberType(abiItem.stateMutability)}
                    name={abiItem.name}
                    proof={proof}
                    queueContract={queueContract}
                    queueAddress={queueAddress}
                    rawAbiItem={abiItem}
                    targetContract={targetContract}
                  />
                </Frame>
              ))}
            </Frame>
            <Frame>
              <h2> View functions </h2>
              {abiViewFunctions!.map((abiItem: AbiType) => (
                <Frame key={abiItem.name}>
                  <ContractCallHandler
                    config={config}
                    contractAddress={contractAddress}
                    ercContract={ercContract}
                    executor={executorAddress}
                    handleSetExecutionResult={handleSetExecutionResult}
                    inputs={abiItem.inputs}
                    memberType={determineMemberType(abiItem.stateMutability)}
                    name={abiItem.name}
                    proof={proof}
                    queueContract={queueContract}
                    queueAddress={queueAddress}
                    rawAbiItem={abiItem}
                    targetContract={targetContract}
                  />
                </Frame>
              ))}
            </Frame>
            <Frame>
              <h2> Events </h2>
              {abiEvents!.map((abiItem: AbiType) => (
                <Frame key={abiItem.name}>
                  <ContractCallHandler
                    config={config}
                    contractAddress={contractAddress}
                    ercContract={ercContract}
                    executor={executorAddress}
                    handleSetExecutionResult={handleSetExecutionResult}
                    inputs={abiItem.inputs}
                    memberType={determineMemberType(abiItem.stateMutability)}
                    name={abiItem.name}
                    proof={proof}
                    queueContract={queueContract}
                    queueAddress={queueAddress}
                    rawAbiItem={abiItem}
                    targetContract={targetContract}
                  />
                </Frame>
              ))}
            </Frame>
          </>
        )}
      </Frame>
    </>
  )
}

type ContractCallHandlerData = {
  contractAddress: string
  config: any
  ercContract: EthersContract | null
  executor: string
  handleSetExecutionResult: (result: string, v: string) => void
  inputs: Input[]
  memberType: string
  name: string
  proof: string
  queueAddress: string
  queueContract: EthersContract | null
  rawAbiItem: AbiType
  targetContract: EthersContract | null
}

interface InputStateData extends Input {
  value: string
}

function ContractCallHandler({
  config,
  contractAddress,
  ercContract,
  executor,
  handleSetExecutionResult,
  inputs,
  memberType,
  name,
  proof,
  queueAddress,
  queueContract,
  rawAbiItem,
  targetContract,
}: ContractCallHandlerData) {
  const [result, setResult] = useState('')
  const [values, setValues] = useState<InputStateData[]>(() => {
    if (inputs.length === 0) {
      return []
    }
    return inputs.map((input: Input) => ({
      name: input.name,
      type: input.type,
      value: '',
    })) as InputStateData[]
  })
  const { account } = useWallet()

  const updateValue = useCallback(
    (name, updatedValue) => {
      if (values) {
        setValues((elements: InputStateData[]) =>
          elements.map((element: InputStateData) =>
            element.name === name
              ? { ...element, value: updatedValue }
              : element,
          ),
        )
      }
    },
    [values],
  )

  const handleCall = useCallback(
    async e => {
      e.preventDefault()

      if (!targetContract) {
        alert('Please input the address for the contract.')
        return
      }

      try {
        const callResponse = await callContractFunction(
          name,
          values,
          targetContract,
        )

        setResult(callResponse)
      } catch (err) {
        // TODO: handle error with sentry.
        console.error(err)
        handleSetExecutionResult(
          'error',
          'There was an error with the function call.',
        )
      }
    },
    [handleSetExecutionResult, name, targetContract, values],
  )

  const handleExecute = useCallback(
    async e => {
      e.preventDefault()
      try {
        if (!queueContract || !account || !targetContract) {
          alert(
            'Executing transactions requires a signer. Please connect your account.',
          )
          return
        }
        handleSetExecutionResult('info', `Sending transaction.`)

        const tx = await sendAction(
          account,
          config,
          ercContract,
          executor,
          proof,
          rawAbiItem,
          values,
          contractAddress,
          queueAddress,
          queueContract,
        )
        await tx.wait(1)

        setResult(tx.hash)
        handleSetExecutionResult(
          'confirmed',
          `Transaction sent successfully. hash: ${tx.hash}`,
        )
      } catch (e) {
        console.error(e)
        handleSetExecutionResult(
          'error',
          `There was an error with the transaction.`,
        )
      }
    },
    [
      account,
      config,
      contractAddress,
      ercContract,
      executor,
      handleSetExecutionResult,
      queueAddress,
      queueContract,
      proof,
      rawAbiItem,
      values,
    ],
  )

  const handleFunctionCall = useCallback(
    e => {
      if (memberType === 'function') {
        handleExecute(e)
      } else {
        handleCall(e)
      }
    },
    [handleCall, handleExecute, memberType],
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
        {values?.map((value: InputStateData, i: number) => (
          <div key={value.name}>
            <label>
              {value.name}
              {value.type === 'bool' ? (
                <select
                  value={values[i].value}
                  onChange={e => updateValue(value.name, e.target.value)}
                  css={`
                    color: black;
                  `}
                >
                  <option value={'true'}>true</option>
                  <option value={'false'}>false</option>
                </select>
              ) : (
                <input
                  value={values[i].value}
                  onChange={e => updateValue(value.name, e.target.value)}
                  css={`
                    margin-top: 12px;
                    color: black;
                  `}
                />
              )}
            </label>
          </div>
        ))}
        <Button type="submit" onClick={handleFunctionCall}>
          Execute
        </Button>
        <span>Result: {result}</span>
      </form>
    </>
  )
}
