import * as React from 'react'
import 'styled-components/macro'

type FrameProps = {
  children: React.ReactNode
}

export default function Frame({ children }: FrameProps): JSX.Element {
  return (
    <div
      css={`
        margin-top: 32px;
        border: 2px solid rgba(255, 255, 255, 0.2);
        padding: 8px;
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
      {children}
    </div>
  )
}
