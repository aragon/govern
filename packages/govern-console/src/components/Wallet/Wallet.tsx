import { useState } from 'react';
import { styled } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { useWallet } from 'use-wallet';
import { AddressIdentifier } from 'components/AddressIdentifier/AddressIdentifier';
import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { networkEnvironment } from 'environment';
import { Button } from '@aragon/ui';

const WalletWrapper = styled(Card)({
  background: '#FFFFFF',
  height: '48px',
  width: '178px',
  // border: '2px solid #252b3e',
  boxSizing: 'border-box',
  // boxShadow: '0px 3px 3px rgba(180, 193, 228, 0.35)',
  boxShadow: 'none',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});
const ConnectedAccount = styled('div')({
  height: '48px',
  width: '174px',
  background: '#FFFFFF',
  border: '2px solid #EFF1F7',
  boxSizing: 'border-box',
  boxShadow: '0px 3px 3px rgba(180, 193, 228, 0.35)',
  borderRadius: '8px',
  justifyContent: 'center',
  alignItems: 'center',
  // padding: '13px 20px',
  display: 'flex',
  flexDirection: 'row',
  cursor: 'pointer',
});
//TODO add the icon for logged in users
declare let window: any;

const Wallet = ({}) => {
  const context: any = useWallet();
  const { account, chainId, connect, error, reset, status } = context;
  const [networkStatus, setNetworkStatus] = useState<string>(status);
  const [userAccount, setUserAccount] = useState<string>(status);
  const { enqueueSnackbar } = useSnackbar();

  // useEffect(() => {
  //   connectWalletAndSetStatus('injected');
  // }, []);
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
      enqueueSnackbar('Your wallet is successfully connected.', {
        variant: 'success',
      });
    } else {
      setNetworkStatus('disconnected');
    }
  }, [status, chainId, enqueueSnackbar, error]);

  useEffect(() => {
    if (status === 'disconnected') {
      return;
    }
    if (error) {
      if (error.message.includes('Unsupported chain')) {
        enqueueSnackbar('Please select the correct chain in your wallet.', {
          variant: 'error',
        });
      } else if (error.message.includes('window.ethereum')) {
        enqueueSnackbar('Please install a wallet.', {
          variant: 'error',
        });
      } else {
        enqueueSnackbar(error.message, {
          variant: 'error',
        });
      }
    }
  }, [status, error, enqueueSnackbar]);

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
      <WalletWrapper>
        <ConnectedAccount
          onClick={() => {
            reset();
          }}
        >
          {/* <IconHolder src={connectedUserIcon} /> */}
          <AddressIdentifier
            isAddress={true}
            displayText={userAccount || ''}
            componentSize={'medium'}
          />
        </ConnectedAccount>
      </WalletWrapper>
    );
  } else if (networkStatus === 'unsupported') {
    return (
      <WalletWrapper>
        <Button
          size="large"
          type="secondary"
          onClick={() => {
            connectWalletAndSetStatus('injected');
            // connect('injected');
            // setActivatingConnector(ConnectorNames.Injected);
          }}
          label={'Connect Account'}
          disabled={status === 'connecting'}
        />
      </WalletWrapper>
    );
  } else if (networkStatus === 'connection-error') {
    return (
      <WalletWrapper>
        <Button
          size="large"
          type="secondary"
          onClick={() => {
            connectWalletAndSetStatus('injected');
            // connect('injected');
            // setActivatingConnector(ConnectorNames.Injected);
          }}
          label={'Connect Account'}
          disabled={status === 'connecting'}
        />
      </WalletWrapper>
    );
  } else {
    return (
      // <WalletWrapper>
      <Button
        size="large"
        type="secondary"
        onClick={() => {
          connectWalletAndSetStatus('injected');
          // connect('injected');
          // setActivatingConnector(ConnectorNames.Injected);
        }}
        label={'Connect Account'}
        height={'48px'}
        width={'174px'}
        disabled={status === 'connecting'}
      />
      // </WalletWrapper>
    );
  }
};

export default Wallet;
