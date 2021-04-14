import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import Home from 'containers/HomePage/HomePage';
import { Web3Provider } from '@ethersproject/providers';
import { BrowserRouter as Router } from 'react-router-dom';

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

export default function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Router>
        <Home />
      </Router>
    </Web3ReactProvider>
  );
}
