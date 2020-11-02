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
        font-family: 'Roboto Mono', monospace;
        font-size: 18px;
        position: relative;
        background: transparent;
        color: white;
        min-width: 136px;
        min-height: 40px;
        cursor: pointer;
        border: 2px solid transparent;
        border-image: linear-gradient(to bottom right, #AD41BB 20%, #FF7D7D 100%);
        border-image-slice: 1;

        &:active {
          top: 1px;
        }
      `}
    >
      {children}
    </button>
  )
}
