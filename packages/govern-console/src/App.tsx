import Home from 'containers/HomePage/HomePage';
import { HashRouter as Router } from 'react-router-dom';
import { WalletProvider } from './providers/AugmentedWallet';

const App = () => {
  return (
    <WalletProvider>
      <Router>
        <Home />
      </Router>
    </WalletProvider>
  );
};

export default App;
