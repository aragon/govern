import React from 'react'
import 'styled-components/macro'

type ButtonProps = {
    children: React.ReactNode
    onClick: () => void
}

export default function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      css={`
        font-family: 'Overpass Mono', monospace;
        font-size: 12px;
        position: relative;
        background: transparent;
        color: white;
        cursor: pointer;

        &:hover {
        background: rgba(255, 255, 255, 0.2);
        }
        &:active {
        top: 1px;
        }
      `}
    >
      {children}
    </button>
    )
}