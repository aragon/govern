import Home from 'containers/HomePage/HomePage';
import { HashRouter as Router } from 'react-router-dom';
import { WalletProvider } from './AugmentedWallet';
import ScrollToTop from './scrollToTop';

const App = () => {
  return (
    <WalletProvider>
      <Router>
        <ScrollToTop />
        <Home />
      </Router>
    </WalletProvider>
  );
};

export default App;
