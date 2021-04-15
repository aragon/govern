import React from 'react';
import { ANButton } from 'components/Button/ANButton';
import { styled } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { useWallet } from 'use-wallet';
import connectedUserIcon from 'images/connected-user-icon.svg';
import Typography from '@material-ui/core/Typography';

const Wallet = ({}) => {
  const context = useWallet();
  const [activatingConnector, setActivatingConnector] = React.useState<any>();
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
  } = context;

  const onWalletConnectionError = (error: Error) => {
    // alert(getErrorMessage(error));
  };
  // ---- Components ----

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
    padding: '13px 20px',
    display: 'flex',
    flexDirection: 'row',
  });
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
  });
  // React.useEffect(() => {
  //   if (activatingConnector && activatingConnector === connector) {
  //     setActivatingConnector(undefined);
  //   }
  // }, [connector]);
  const getTruncatedAccountAddress = (account: string | null) => {
    if (account === null) return '';
    return (
      account.substring(0, 5) +
      '...' +
      account.substring(account.length - 5, account.length - 1)
    );
  };
  debugger;
  return (
    <WalletWrapper>
      {status !== 'connected' ? (
        <ANButton
          type="primary"
          onClick={() => {
            connect('injected');
            // setActivatingConnector(ConnectorNames.Injected);
          }}
          label={'Connect Account'}
          height={'48px'}
          width={'174px'}
          disabled={status === 'connecting'}
        />
      ) : (
        <ConnectedAccount
          onClick={() => {
            // connect('injected');
            // setActivatingConnector(ConnectorNames.Injected);
          }}
        >
          {/* <IconHolder src={connectedUserIcon}> </IconHolder> */}
          <AccountAddress>{getTruncatedAccountAddress(account)}</AccountAddress>
        </ConnectedAccount>
      )}
    </WalletWrapper>
  );
};

export default Wallet;
