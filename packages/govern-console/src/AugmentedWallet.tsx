import React, { useEffect, useContext, useMemo } from 'react';
import { ethers, providers as EthersProviders } from 'ethers';
import { UseWalletProvider, useWallet } from 'use-wallet';
import { Account } from 'utils/types';
import { INFURA_PROJECT_ID } from 'utils/constants';

const WalletAugmentedContext = React.createContext({});

function useWalletAugmented() {
  return useContext(WalletAugmentedContext);
}

// Adds Ethers.js to the useWallet() object
const WalletAugmented: React.FC<unknown> = ({ children }) => {
  const wallet = useWallet();
  const ethereum: any = wallet.ethereum;
  const fallbackProvider = ethers.getDefaultProvider('rinkeby', {
    infura: INFURA_PROJECT_ID,
  });
  const [provider, updateProvider] = React.useState(fallbackProvider);
  const injectedProvider = useMemo(
    () => (ethereum ? new EthersProviders.Web3Provider(ethereum) : null),
    [ethereum],
  );

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

  return (
    <WalletAugmentedContext.Provider value={contextValue}>
      {children}
    </WalletAugmentedContext.Provider>
  );
};

const WalletProvider: React.FC<unknown> = ({ children }) => {
  return (
    <UseWalletProvider chainId={4}>
      <WalletAugmented>{children}</WalletAugmented>
    </UseWalletProvider>
  );
};

export { useWalletAugmented as useWallet, WalletProvider };
