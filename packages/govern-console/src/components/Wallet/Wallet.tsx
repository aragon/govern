import { useState } from 'react';
import { useWallet } from 'use-wallet';
import { useEffect } from 'react';
import { networkEnvironment } from 'environment';
import { Button, EthIdenticon, useLayout, IconConnect, useToast } from '@aragon/ui';
import { getTruncatedAccountAddress } from 'utils/account';

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
      toast('Your wallet is successfully connected.');
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
        toast('Please select the correct chain in your wallet.');
      } else if (error.message.includes('window.ethereum')) {
        toast('Please install a wallet.');
      } else {
        toast(error.message);
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

  if (networkStatus === 'connected') {
    return (
      <Button
        size="large"
        mode="secondary"
        label={getTruncatedAccountAddress(userAccount)}
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
