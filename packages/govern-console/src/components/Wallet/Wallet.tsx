/* eslint-disable */
import React, { useState } from 'react';
import { ANButton } from 'components/Button/ANButton';
import { styled } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { useWallet } from 'use-wallet';
import connectedUserIcon from 'images/connected-user-icon.svg';
import { AddressIdentifier } from 'components/AddressIdentifier/AddressIdentifier';
import Typography from '@material-ui/core/Typography';
import { useEffect } from 'react';
import { getTruncatedAccountAddress } from 'utils/account';
import { useSnackbar } from 'notistack';

const WalletWrapper = styled(Card)({
  background: '#FFFFFF',
  height: '48px',
  width: '178px',
  // border: '2px solid #EFF1F7',
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
const IconHolder = styled('img')({
  width: '24px',
  height: '24px',
});
const AccountAddress = styled(Typography)({
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: '16px',
  lineHeight: '22px',
  color: '#20232C',
  cursor: 'pointer',
  textAlign: 'center',
  width: '100%',
});

const Wallet = ({}) => {
  const context: any = useWallet();
  const {
    account,
    balance,
    chainId,
    connect,
    error,
    reset,
    status,
    provider,
  } = context;
  const [networkStatus, setNetworkStatus] = useState<string>(status);
  const [userAccount, setUserAccount] = useState<string>(status);
  const { enqueueSnackbar } = useSnackbar();

  // useEffect(() => {
  //   connectWalletAndSetStatus('injected');
  // }, []);
  useEffect(() => {
    if (chainId !== 4) {
      setNetworkStatus('unsupported');
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
  }, [status]);

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
  }, [error]);

  useEffect(() => {
    if (account) {
      setUserAccount(account);
    }
  }, [account]);

  const connectWalletAndSetStatus = async (type: string) => {
    try {
      if (type === 'injected') {
        connect('injected');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

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
        <ANButton
          buttonType="primary"
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
      </WalletWrapper>
    );
  } else if (networkStatus === 'connection-error') {
    return (
      <WalletWrapper>
        <ANButton
          buttonType="primary"
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
      </WalletWrapper>
    );
  } else {
    return (
      // <WalletWrapper>
      <ANButton
        buttonType="primary"
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
