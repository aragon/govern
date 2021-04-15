import React from 'react';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '../src/AragonTheme';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import '../src/App.css';

const subgraphUri =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-govern-rinkeby';

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

export const decorators = [
  (Story) => (
    <ThemeProvider theme={lightTheme}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <ApolloProvider client={client}>
          <Story />
        </ApolloProvider>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  ),
];
