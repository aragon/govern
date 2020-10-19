import React from 'react'
import 'styled-components/macro'

export default function Button({
  children,
  disabled = false,
  onClick,
  type,
}: React.HTMLProps<HTMLButtonElement>) {
  return (
    <button
      disabled={disabled}
      //@ts-ignore
      type={type!}
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
