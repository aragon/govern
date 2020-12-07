import React, { useCallback, useState } from 'react'
import { useHistory, useParams, useRouteMatch } from 'react-router-dom'
import 'styled-components/macro'
import Button from '../components/Button'

export default function SelectDao() {
  const [daoName, setDaoName] = useState('')
  const history = useHistory()
  const { network }: any = useParams()
  const handleChangeDaoAddress = useCallback(e => {
    setDaoName(e.target.value)
  }, [])
  const handleGoToDao = useCallback(() => {
    history.push(`/${network}/${daoName}`)
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
    </>
  )
}
