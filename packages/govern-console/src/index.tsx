import React from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { QueryCache, ReactQueryCacheProvider } from 'react-query'
import { createGlobalStyle } from 'styled-components'
import 'styled-components/macro'
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'
import App from './App'
import GeneralProvider from './Providers/GeneralProvider'

const queryCache = new QueryCache()

export const rinkebyClient: ApolloClient<NormalizedCacheObject> = new ApolloClient(
  {
    uri: 'https://api.thegraph.com/subgraphs/name/evalir/aragon-govern-rinkeby',
    cache: new InMemoryCache(),
  },
)

export const mainnetClient: ApolloClient<NormalizedCacheObject> = new ApolloClient(
  {
    uri: 'https://api.thegraph.com/subgraphs/name/aragon/aragon-govern-mainnet',
    cache: new InMemoryCache(),
  },
)

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
  <ApolloProvider client={rinkebyClient}>
    <ReactQueryCacheProvider queryCache={queryCache}>
      <GeneralProvider>
        <React.StrictMode>
          <GlobalStyle />
          <HashRouter>
            <App />
          </HashRouter>
        </React.StrictMode>
      </GeneralProvider>
    </ReactQueryCacheProvider>
  </ApolloProvider>,
  document.getElementById('root'),
)
