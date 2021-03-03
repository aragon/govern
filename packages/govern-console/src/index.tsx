import React from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { QueryCache, ReactQueryCacheProvider } from 'react-query'
import { createGlobalStyle } from 'styled-components'
import 'styled-components/macro'
import App from './App'
import GeneralProvider from './Providers/GeneralProvider'

const queryCache = new QueryCache()

const GlobalStyle = createGlobalStyle`
  *, *:before, *:after {
    box-sizing: border-box;
  }
  html {
    -webkit-overflow-scrolling: touch;
  }
  body {
    height: 0;
    min-height: 100vh;
    background: black;
    color: white;
    font-family: 'Roboto Mono', Helvetica, sans-serif;
  }
  body, ul, p, h1, h2, h3, h4, h5, h6 {
    margin: 0;
    padding: 0;
  }
  button, select, input, textarea, h1, h2, h3, h4, h5, h6 {
    font-size: inherit;
    font-family: inherit;
    font-weight: inherit;
    line-height: inherit;
  }
  a, button, select, input, textarea {
    color: inherit;
  }
  strong, b {
    font-weight: 600;
  }
`

render(
  <ReactQueryCacheProvider queryCache={queryCache}>
    <HashRouter>
      <GeneralProvider>
        <React.StrictMode>
          <GlobalStyle />
          <App />
        </React.StrictMode>
      </GeneralProvider>
    </HashRouter>
  </ReactQueryCacheProvider>,
  document.getElementById('root'),
)
