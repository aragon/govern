import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import 'styled-components/macro'

const KNOWN_TOOLS = [
  {
    name: 'ERC-20 Tool',
    id: 'erc',
  },
]

export default function DaoSelector() {
  const [daoName, setDaoName] = useState<string>('')
  const history = useHistory()

  const handleChangeDaoAddress = useCallback(e => {
    setDaoName(e.target.value)
  }, [])
  const handleGoToDao = useCallback(() => {
    history.push(`/${daoName}`)
  }, [daoName, history])

  return (
    <>
      <form
        css={`
          padding: 8px;
          margin-top: ${4 * 8}px;
          border: 1px solid whitesmoke;
        `}
      >
        <label>
          Enter DAO address
          <input
            type="input"
            onChange={handleChangeDaoAddress}
            placeholder="0xbeef..."
            value={daoName}
            css={`
              margin-top: 12px;
              width: 100%;
              color: black;
            `}
          />
        </label>
        <button
          onClick={handleGoToDao}
          disabled={!daoName}
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
      <div
        css={`
          padding: 8px;
          margin-top: ${4 * 8}px;
          border: 1px solid whitesmoke;
        `}
      >
        <h2>Tools</h2>
        {KNOWN_TOOLS.map(({ name, id }) => (
          <ToolCard key={id} name={name} id={id} />
        ))}
      </div>
    </>
  )
}

type ToolCardProps = {
  name: string
  id: string
}

function ToolCard({ name, id }: ToolCardProps) {
  const history = useHistory()

  const handleCardClick = useCallback(() => {
    history.push(`/tools/${id}`)
  }, [history, id])

  return (
    <button
      type="button"
      onClick={handleCardClick}
      css={`
        position: relative;
        background: transparent;
        width: 280px;
        height: 320px;
        border: 1px solid #00f400;
        padding: 16px;
        cursor: pointer;
        &:not(:last-child) {
          margin-right: 24px;
          margin-bottom: 24px;
        }
        &:active {
          top: 1px;
        }
      `}
    >
      {name}
    </button>
  )
}
