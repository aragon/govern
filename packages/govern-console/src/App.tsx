import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import Home from 'containers/HomePage/HomePage';
import { Web3Provider } from '@ethersproject/providers';
import { BrowserRouter as Router } from 'react-router-dom';
import { WalletProvider } from './EthersWallet';

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

export default function App() {
  return (
    <WalletProvider>
      <Router>
        <Home />
      </Router>
    </WalletProvider>
  );
}
