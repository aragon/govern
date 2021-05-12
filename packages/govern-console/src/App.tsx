import React from 'react';
// import { Web3ReactProvider } from '@web3-react/core';
import Home from 'containers/HomePage/HomePage';
import { Web3Provider } from '@ethersproject/providers';
import { HashRouter as Router } from 'react-router-dom';
import { WalletProvider } from './AugmentedWallet';
import { SnackbarProvider } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  success: {
    backgroundColor: '#E8FAF9 !important',
    color: '#17C271 !important',
    width: '293px',
  },
  error: {
    backgroundColor: '#F8E8EB !important',
    color: '#FF6A60 !important',
    width: '293px',
  },
  warning: {
    backgroundColor: '#FFF8EA !important',
    color: '#F9A31B !important',
    width: '293px',
  },
  info: {
    width: '293px',
    backgroundColor: '#E9F3FF !important',
    color: '#0176FF !important',
  },
}));

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

const App = () => {
  const toastClasses = useStyles();
  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      classes={{
        variantSuccess: toastClasses.success,
        variantError: toastClasses.error,
        variantWarning: toastClasses.warning,
        variantInfo: toastClasses.info,
      }}
    >
      <WalletProvider>
        <Router>
          <Home />
        </Router>
      </WalletProvider>
    </SnackbarProvider>
  );
};

export default App;
