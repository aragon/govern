import React, { useCallback, useMemo, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import 'styled-components/macro'
import { shortenAddress } from '../../lib/web3-utils'

type FilteredActionsProps = {
  actions: any[]
  actionsPerPage: number
}

export default function FilteredActions({
  actions,
  actionsPerPage,
}: FilteredActionsProps) {
  const [selected, setSelected] = useState(0)
  const [selectedFilter, setSelectedFilter] = useState<
    'Executed' | 'Scheduled' | 'All'
  >('All')
  const handleChangeFilter = useCallback(
    (filterValue: string) => {
      if (
        filterValue !== 'All' &&
        filterValue !== 'Executed' &&
        filterValue !== 'Scheduled'
      ) {
        throw new Error('Invalid filter')
      }
      setSelectedFilter(filterValue)
    },
    [setSelectedFilter],
  )
  const first = useMemo(() => selected * actionsPerPage, [
    selected,
    actionsPerPage,
  ])
  const last = useMemo(
    () =>
      Math.min(actions.length || 0, selected * actionsPerPage + actionsPerPage),
    [actionsPerPage, actions, selected],
  )

  const filteredActions = actions.filter((action: any) => {
    if (selectedFilter === 'All' || action.state === selectedFilter) {
      return true
    }

    return false
  })

  const pages = useMemo(
    () => Math.ceil(filteredActions.length / actionsPerPage),
    [filteredActions, actionsPerPage],
  )

  const filteredAndPaginatedActions = filteredActions.slice(first, last)
  const paginationItems = useMemo(() => [...Array(pages)].map((_, i) => i), [
    pages,
  ])

  const hasActions = useMemo(() => actions.length > 0, [actions])

  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
      `}
    >
      <select
        value={selectedFilter}
        onChange={e => handleChangeFilter(e.target.value)}
        css={`
          color: black;
          max-width: 180px;
          margin-bottom: 16px;
        `}
      >
        <option value="All">All</option>
        <option value="Executed">Executed</option>
        <option value="Scheduled">Scheduled</option>
      </select>
      <div
        css={`
          display: flex;
          flex-wrap: wrap;
        `}
      >
        {hasActions &&
          filteredAndPaginatedActions
            .reverse()
            .map(({ id, state }: { id: string; state: string }) => (
              <ActionCard id={id} state={state} key={id} />
            ))}
      </div>
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px 0;
          & > div + div {
            margin-left: 8px;
          }
        `}
      >
        {paginationItems.map((idx: number) => (
          <PaginationItem onClick={() => setSelected(idx)} key={idx}>
            {idx + 1}
          </PaginationItem>
        ))}
      </div>
    </div>
  )
}

type PaginationItemProps = {
  children: React.ReactNode
  onClick: () => void
}
function PaginationItem({ children, onClick }: PaginationItemProps) {
  return (
    <button
      onClick={onClick}
      css={`
        font-family: 'Roboto Mono', monospace;
        font-size: 18px;
        position: relative;
        background: transparent;
        color: white;
        min-height: 40px;
        cursor: pointer;
        border: 2px solid transparent;
        border-image: linear-gradient(
          to bottom right,
          #ad41bb 20%,
          #ff7d7d 100%
        );
        border-image-slice: 1;
        margin-right: 8px;

        &:active {
          top: 1px;
        }
      `}
    >
      {children}
    </button>
  )
}

type ActionCardProps = {
  id: string
  state: string
}

function ActionCard({ id, state }: ActionCardProps) {
  const history = useHistory()
  const { daoAddress }: any = useParams()

  const handleCardClick = useCallback(() => {
    history.push(`${daoAddress}/view-action/${id}`)
  }, [daoAddress, history, id])

  return (
    <div
      role="button"
      css={`
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
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
        margin-right: 8px;
        cursor: pointer;
        &:not(:last-child) {
          margin-right: 24px;
          margin-bottom: 24px;
        }
        &:active {
          top: 1px;
        }
      `}
      onClick={handleCardClick}
    >
      <div
        css={`
          margin-bottom: 16px;
        `}
      >
        {shortenAddress(id)}
      </div>
      {state}
    </div>
  )
}
