import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import 'styled-components/macro'
import Button from '../components/Button'

const KNOWN_TOOLS = [
  {
    name: 'ERC-20 Tool',
    id: 'erc',
  },
]

export default function DaoSelector() {
  const [daoName, setDaoName] = useState('')
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
          border: 2px solid rgba(255, 255, 255, 0.2);
        `}
      >
        <label>
          Enter DAO name
          <input
            type="input"
            onChange={handleChangeDaoAddress}
            placeholder="DAO Name"
            value={daoName}
            css={`
              margin-top: 12px;
              margin-bottom: 8px;
              width: 100%;
              min-height: 43px;
              background: black;
              border: 2px solid white;
              color: white;
            `}
          />
        </label>
        <Button onClick={handleGoToDao} disabled={!daoName}>
          Go to DAO
        </Button>
      </form>
      <div
        css={`
          padding: 8px;
          margin-top: ${4 * 8}px;
          border: 2px solid rgba(255, 255, 255, 0.2);
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
        border: 2px solid transparent;
        border-image: linear-gradient(
          to bottom right,
          #ad41bb 20%,
          #ff7d7d 100%
        );
        border-image-slice: 1;
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
