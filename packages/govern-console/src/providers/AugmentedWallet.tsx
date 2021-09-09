import React, { useEffect, useContext, useMemo } from 'react';
import { providers as EthersProviders } from 'ethers';
import { UseWalletProvider, useWallet } from 'use-wallet';
import { Account } from 'utils/types';
import { INFURA_PROJECT_ID } from 'utils/constants';
import { networkEnvironment } from 'environment';
import { identifyUser } from 'services/analytics';
import { useAPM, updateAPMContext } from './elasticAPM';
const { chainId } = networkEnvironment;

const WalletAugmentedContext = React.createContext({});

function useWalletAugmented() {
  return useContext(WalletAugmentedContext);
}

// Adds Ethers.js to the useWallet() object
const WalletAugmented: React.FC<unknown> = ({ children }) => {
  const wallet = useWallet();
  const ethereum: any = wallet.ethereum;
  const fallbackProvider = new EthersProviders.InfuraProvider(chainId, INFURA_PROJECT_ID);
  const [provider, updateProvider] = React.useState<EthersProviders.Provider>(fallbackProvider);

  const injectedProvider = useMemo(
    () => (ethereum ? new EthersProviders.Web3Provider(ethereum) : null),
    [ethereum],
  );

  useEffect(() => {
    if (
      wallet.status === 'connected' &&
      typeof wallet.account === 'string' &&
      wallet.connector &&
      wallet.networkName
    ) {
      identifyUser(wallet.account, wallet.networkName, wallet.connector);
    }
  }, [wallet.networkName, wallet.connector, wallet.status, wallet.account]);

  useEffect(() => {
    if (injectedProvider) updateProvider(injectedProvider);
  }, [injectedProvider]);

  const contextValue = useMemo(() => {
    let account: Account | undefined = undefined;
    if (injectedProvider && wallet.account) {
      account = {
        address: wallet.account,
        signer: injectedProvider.getSigner(),
      };
    }

    return {
      ...wallet,
      isConnected: wallet.status === 'connected',
      provider,
      account,
    };
  }, [wallet, provider, injectedProvider]);

  const { apm } = useAPM();
  useEffect(() => {
    updateAPMContext(apm, contextValue.networkName);
  }, [apm, contextValue.networkName]);

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
