import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, EthIdenticon, IconConnect, useLayout, useToast } from '@aragon/ui';

import { networkEnvironment } from 'environment';
import { trackEvent, EventType } from 'services/analytics';
import { getTruncatedAccountAddress } from 'utils/account';

const StyledButton = styled(Button).attrs((props) => ({
  size: 'large',
  mode: 'secondary',
  display: 'all',
  style: props.layoutIsSmall ? { height: '48px' } : {},
}))`
  flex: 1;
`;

//TODO add the icon for logged in users
declare let window: any;
const connectButtonLabel = 'Connect wallet';

const Wallet: React.FC = () => {
  const toast = useToast();
  const context: any = useWallet();
  const { layoutName } = useLayout();
  const { account, chainId, connect, error, reset, status, networkName, connector } = context;
  const [networkStatus, setNetworkStatus] = useState<string>(status);
  const [userAccount, setUserAccount] = useState<string>(status);

  const layoutIsSmall = useMemo(() => layoutName === 'small', [layoutName]);

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
      <StyledButton
        label={getTruncatedAccountAddress(userAccount)}
        icon={<EthIdenticon address={userAccount} scale={1.5} radius={50} />}
        onClick={disconnect}
        layoutIsSmall={layoutIsSmall}
      />
    );
  } else if (networkStatus === 'unsupported') {
    return (
      <StyledButton
        onClick={() => {
          connectWalletAndSetStatus('injected');
        }}
        label={connectButtonLabel}
        icon={<IconConnect />}
        disabled={status === 'connecting'}
        layoutIsSmall={layoutIsSmall}
      />
    );
  } else if (networkStatus === 'connection-error') {
    return (
      <StyledButton
        onClick={() => {
          connectWalletAndSetStatus('injected');
        }}
        label={connectButtonLabel}
        icon={<IconConnect />}
        disabled={status === 'connecting'}
        layoutIsSmall={layoutIsSmall}
      />
    );
  } else {
    return (
      <StyledButton
        onClick={() => {
          connectWalletAndSetStatus('injected');
        }}
        label={connectButtonLabel}
        icon={<IconConnect />}
        disabled={status === 'connecting'}
        layoutIsSmall={layoutIsSmall}
      />
    );
  }
};

export default Wallet;
