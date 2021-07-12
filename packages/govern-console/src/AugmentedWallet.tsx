import React, { useEffect, useContext, useMemo } from 'react';
import { providers as EthersProviders } from 'ethers';
import { UseWalletProvider, useWallet } from 'use-wallet';
import { Account } from 'utils/types';
import { INFURA_PROJECT_ID } from 'utils/constants';
import { networkEnvironment } from 'environment';
import { identifyUser } from 'services/analytics';
const { chainId } = networkEnvironment;

const WalletAugmentedContext = React.createContext({});

function useWalletAugmented() {
  return useContext(WalletAugmentedContext);
}

// Adds Ethers.js to the useWallet() object
const WalletAugmented: React.FC<unknown> = ({ children }) => {
  const wallet = useWallet();
  const { networkName, connector, status, account } = wallet;
  const ethereum: any = wallet.ethereum;
  const fallbackProvider = new EthersProviders.InfuraProvider(chainId, INFURA_PROJECT_ID);
  const [provider, updateProvider] = React.useState<EthersProviders.Provider>(fallbackProvider);

  const injectedProvider = useMemo(
    () => (ethereum ? new EthersProviders.Web3Provider(ethereum) : null),
    [ethereum],
  );

  useEffect(() => {
    if (status === 'connected' && typeof account === 'string' && connector && networkName) {
      identifyUser(account, networkName, connector);
    }
  }, [networkName, connector, status, account]);

  useEffect(() => {
    if (injectedProvider) updateProvider(injectedProvider);
  }, [injectedProvider]);

  const contextValue = useMemo(() => {
    let account: Account | undefined = undefined;
    if (injectedProvider && account) {
      account = {
        address: account,
        signer: injectedProvider.getSigner(),
      };
    }

    return {
      ...wallet,
      isConnected: status === 'connected',
      provider,
      account,
    };
  }, [wallet, provider, injectedProvider, status]);

  return (
    <WalletAugmentedContext.Provider value={contextValue}>
      {children}
    </WalletAugmentedContext.Provider>
  );
};

const WalletProvider: React.FC<unknown> = ({ children }) => {
  return (
    <UseWalletProvider chainId={chainId}>
      <WalletAugmented>{children}</WalletAugmented>
    </UseWalletProvider>
  );
};

export { useWalletAugmented as useWallet, WalletProvider };
