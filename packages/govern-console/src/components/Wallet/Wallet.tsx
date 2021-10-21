import { useState } from 'react';
import { useWallet } from 'use-wallet';
import { useEffect } from 'react';
import { networkEnvironment } from 'environment';
import { Button, EthIdenticon, IconConnect, useToast } from '@aragon/ui';
import { getTruncatedAccountAddress } from 'utils/account';
import { trackEvent, EventType } from 'services/analytics';
import { useCallback } from 'react';

//TODO add the icon for logged in users
declare let window: any;

type WalletProps = {
  buttonCSS?: string;
};

const Wallet: React.FC<WalletProps> = ({ buttonCSS }) => {
  const connectButtonLabel = 'Connect wallet';
  const context: any = useWallet();
  const toast = useToast();
  const { account, chainId, connect, error, reset, status, networkName, connector } = context;
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

  const disconnect = useCallback(() => {
    // analytics
    trackEvent(EventType.WALLET_DISCONNECTED, {
      wallet_address: userAccount,
      wallet_provider: connector, // provider name would make more sense
      network: networkName,
    });

    reset();
  }, [connector, networkName, reset, userAccount]);

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
        display={'all'}
        onClick={disconnect}
        css={buttonCSS}
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
        label={connectButtonLabel}
        icon={<IconConnect />}
        display={'all'}
        disabled={status === 'connecting'}
        css={buttonCSS}
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
        label={connectButtonLabel}
        icon={<IconConnect />}
        display={'all'}
        disabled={status === 'connecting'}
        css={buttonCSS}
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
        label={connectButtonLabel}
        icon={<IconConnect />}
        display={'all'}
        disabled={status === 'connecting'}
        css={buttonCSS}
      />
    );
  }
};

export default Wallet;
