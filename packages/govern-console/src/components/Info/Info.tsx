import React from 'react'
import 'styled-components/macro'

type InfoProps = {
  mode: 'error' | 'info' | 'success' | ''
  children: React.ReactNode
}

function resolveColorsFromStatus(mode: string): string {
  if (mode === 'error') {
    return 'red'
  }
  if (mode === 'success') {
    return 'green'
  }
  return 'cyan'
}

export default function Info({ mode, children }: InfoProps): JSX.Element {
  return (
    <div
      css={`
        padding: 8px;
        margin-top: 32px;
        margin-bottom: 32px;
        border: 1px solid ${resolveColorsFromStatus(mode)};
      `}
    >
      {children}
    </div>
  )
}
