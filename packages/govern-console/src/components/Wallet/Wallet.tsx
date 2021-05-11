import React, { useState } from 'react';
import { ANButton } from 'components/Button/ANButton';
import { styled } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { useWallet } from 'use-wallet';
import connectedUserIcon from 'images/connected-user-icon.svg';
import { AddressIdentifier } from 'components/AddressIdentifier/AddressIdentifier';
import Typography from '@material-ui/core/Typography';
import { useEffect } from 'react';
import Toast from 'components/Toasts/Toast';
import { getTruncatedAccountAddress } from 'utils/account';

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
    connector,
    account,
    balance,
    chainId,
    connect,
    connectors,
    ethereum,
    error,
    getBlockNumber,
    networkName,
    reset,
    status,
    type,
    provider,
  } = context;
  const [networkStatus, setNetworkStatus] = useState<string>(status);
  // console.log('status', status, 'account', account, error);

  const onWalletConnectionError = (error: Error) => {
    // alert(getErrorMessage(error));
  };

  const handleCloseToast = () => {
    setOpenToast(false);
  };

  useEffect(() => {
    connectWalletAndSetStatus('injected');
  }, []);
  useEffect(() => {
    console.log(status, account, chainId, error);
    if (chainId !== 4) {
      console.log('chainId', chainId);
      setNetworkStatus('unsupported');
      setOpenToast(true);
    } else if (error) {
      // console.log('error11111', error.message, typeof error.message);
      if (error.message.includes('Unsupported chain')) {
        setNetworkStatus('unsupported');
      } else {
        setNetworkStatus('connection-error');
      }
      setOpenToast(true);
    } else if (status === 'connected') {
      setNetworkStatus('connected');
      setOpenToast(true);
    } else {
      setNetworkStatus('disconnected');
      setOpenToast(true);
    }
  }, [status, error, chainId]);
  // ---- Components ----

  // React.useEffect(() => {
  //   if (activatingConnector && activatingConnector === connector) {
  //     setActivatingConnector(undefined);
  //   }
  // }, [connector]);

  const connectWalletAndSetStatus = async (type: string) => {
    try {
      if (type === 'injected') {
        connect('injected');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const [openToast, setOpenToast] = useState(false);
  if (networkStatus === 'connected') {
    return (
      <WalletWrapper>
        <ConnectedAccount
          onClick={() => {
            // connect('injected');
            // setActivatingConnector(ConnectorNames.Injected);
          }}
        >
          {/* <IconHolder src={connectedUserIcon} /> */}
          <AddressIdentifier
            isAddress={true}
            displayText={account || ''}
            componentSize={'medium'}
          />
        </ConnectedAccount>
        <Toast
          message={'Wallet Connected.'}
          isOpen={openToast}
          onClose={handleCloseToast}
          type={'success'}
          verticalPosition={'bottom'}
          horizontalPosition={'right'}
        />
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
        <Toast
          message={'Please select the correct chain in your wallet.'}
          isOpen={openToast}
          type={'error'}
          onClose={handleCloseToast}
          verticalPosition={'bottom'}
          horizontalPosition={'right'}
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
        <Toast
          message={'Connection Error. Please Try Again.'}
          isOpen={openToast}
          type={'error'}
          onClose={handleCloseToast}
          verticalPosition={'bottom'}
          horizontalPosition={'right'}
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
