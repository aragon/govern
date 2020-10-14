import React, { useState } from 'react'
import 'styled-components/macro'

type NewActionProps = {
  config: any
}

export default function NewAction({ config }: NewActionProps) {
  const [abi, setAbi] = useState('')

  console.log(config)

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
        <button
          onClick={() => {}}
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
          Go to DAO
        </button>
      </form>
    </div>
    </>
  )
}