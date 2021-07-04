import { useState } from 'react';
import { useWallet } from 'use-wallet';
import { useEffect } from 'react';
import { networkEnvironment } from 'environment';
import { Button, EthIdenticon, useLayout, IconConnect, useToast } from '@aragon/ui';

//TODO add the icon for logged in users
declare let window: any;

const Wallet = ({}) => {
  const context: any = useWallet();
  const { layoutName } = useLayout();
  const toast = useToast();
  const { account, chainId, connect, error, reset, status } = context;
  const [networkStatus, setNetworkStatus] = useState<string>(status);
  const [userAccount, setUserAccount] = useState<string>(status);

  useEffect(() => {
    if (chainId !== networkEnvironment.chainId) {
      setNetworkStatus('wrong-network');
    } else if (error) {
      if (error.message.includes('Unsupported chain')) {
        setNetworkStatus('unsupported');
      } else {
        setNetworkStatus('connection-error');
      }
    } else if (status === 'connected') {
      setNetworkStatus('connected');
      toast('Your wallet is successfully connected.', {
        variant: 'success',
      });
    } else {
      setNetworkStatus('disconnected');
    }
  }, [status, chainId, toast, error]);

  useEffect(() => {
    if (status === 'disconnected') {
      return;
    }
    if (error) {
      if (error.message.includes('Unsupported chain')) {
        toast('Please select the correct chain in your wallet.', {
          variant: 'error',
        });
      } else if (error.message.includes('window.ethereum')) {
        toast('Please install a wallet.', {
          variant: 'error',
        });
      } else {
        toast(error.message, {
          variant: 'error',
        });
      }
    }
  }, [status, error, toast]);

  const connectWalletAndSetStatus = async (type: string) => {
    try {
      if (type === 'injected') {
        connect('injected');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  //TODO: not suitable connectWalletAndSetStatus has to re-thought
  /* eslint-disable */
  useEffect(() => {
    if (window && window.ethereum) {
      connectWalletAndSetStatus('injected');
    }
  }, [window]);
  /* eslint-disable */

  useEffect(() => {
    if (account) {
      setUserAccount(account);
    }
  }, [account]);

  const getDisplayText = (displayText: string, isAddress: boolean) => {
    if (isAddress) {
      const formattedAddress =
        displayText.slice(0, 5) +
        '...' +
        displayText.slice(displayText.length - 5, displayText.length - 1);
      return formattedAddress;
    } else {
      let formattedName = displayText;
      if (displayText.length > 20) {
        formattedName = displayText.slice(0, 19);
      }
      return formattedName;
    }
  };

  if (networkStatus === 'connected') {
    return (
      <Button
        size="large"
        mode="secondary"
        label={getDisplayText(userAccount, true)}
        icon={<EthIdenticon address={userAccount} scale={1.5} radius={50} />}
        display={layoutName === 'small' ? 'icon' : 'all'}
        onClick={() => {
          reset();
        }}
      />
    );
  } else if (networkStatus === 'unsupported') {
    return (
      <Button
        size="large"
        mode="secondary"
        onClick={() => {
          connectWalletAndSetStatus('injected');
        }}
        label={'Connect Account'}
        icon={<IconConnect />}
        display={layoutName === 'small' ? 'icon' : 'all'}
        disabled={status === 'connecting'}
      />
    );
  } else if (networkStatus === 'connection-error') {
    return (
      <Button
        size="large"
        mode="secondary"
        onClick={() => {
          connectWalletAndSetStatus('injected');
        }}
        label={'Connect Account'}
        icon={<IconConnect />}
        display={layoutName === 'small' ? 'icon' : 'all'}
        disabled={status === 'connecting'}
      />
    );
  } else {
    return (
      <Button
        size="large"
        mode="secondary"
        onClick={() => {
          connectWalletAndSetStatus('injected');
        }}
        label={'Connect Account'}
        icon={<IconConnect />}
        display={layoutName === 'small' ? 'icon' : 'all'}
        disabled={status === 'connecting'}
      />
    );
  }
};

export default Wallet;
