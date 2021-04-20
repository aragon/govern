import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import Home from 'containers/HomePage/HomePage';
import { Web3Provider } from '@ethersproject/providers';
import { BrowserRouter as Router } from 'react-router-dom';
import { UseWalletProvider } from 'use-wallet';

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

export default function App() {
  return (
    <UseWalletProvider
      chainId={4}
      connectors={
        {
          // This is how connectors get configured
          // portis: { dAppId: 'my-dapp-id-123-xyz' },
          // test test test
        }
      }
    >
      <Router>
        <Home />
      </Router>
    </UseWalletProvider>
  );
}
