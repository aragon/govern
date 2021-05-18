import Home from 'containers/HomePage/HomePage';
import { HashRouter as Router } from 'react-router-dom';
import { WalletProvider } from './AugmentedWallet';
import SnackBarProvider from './customProviders/snackbarProvider';

const App = () => {
  return (
    <SnackBarProvider>
      <WalletProvider>
        <Router>
          <Home />
        </Router>
      </WalletProvider>
    </SnackBarProvider>
  );
};

export default App;
