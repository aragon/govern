/* eslint-disable*/
import React, { useContext, useMemo } from 'react';
import { providers as EthersProviders } from 'ethers';
import { UseWalletProvider, useWallet } from 'use-wallet';
import { Account } from 'utils/types';

const WalletAugmentedContext = React.createContext({});

function useWalletAugmented() {
  return useContext(WalletAugmentedContext);
}

// Adds Ethers.js to the useWallet() object
const WalletAugmented: React.FC<unknown> = ({ children }) => {
  const wallet = useWallet();
  const ethereum: any = wallet.ethereum;

  const provider = useMemo(
    () => (ethereum ? new EthersProviders.Web3Provider(ethereum) : null),
    [ethereum],
  );

  const contextValue = useMemo(() => {
    const account: Account = {
      address: wallet.account,
      signer: provider?.getSigner(),
    };

    return { ...wallet, provider, account };
  }, [wallet, provider]);

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
