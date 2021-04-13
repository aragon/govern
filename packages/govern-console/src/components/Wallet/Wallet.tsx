import React from 'react';
import { ANButton } from 'components/Button/ANButton';
import { styled } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import { Web3Provider } from '@ethersproject/providers';
import { injected } from '../../connectors';

const Wallet = ({}) => {
  const context = useWeb3React<Web3Provider>();
  const [activatingConnector, setActivatingConnector] = React.useState<any>();
  const {
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error,
  } = context;

  enum ConnectorNames {
    Injected = 'Injected',
  }
  const connectorsByName: { [connectorName in ConnectorNames]: any } = {
    [ConnectorNames.Injected]: injected,
  };

  function getErrorMessage(error: Error) {
    if (error instanceof NoEthereumProviderError) {
      return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.';
    } else if (error instanceof UnsupportedChainIdError) {
      return "You're connected to an unsupported network.";
    } else if (error instanceof UserRejectedRequestErrorInjected) {
      return 'Please authorize this website to access your Ethereum account.';
    } else {
      console.error(error);
      return 'An unknown error occurred. Check the console for more details.';
    }
  }
  const onWalletConnectionError = (error: Error) => {
    alert(getErrorMessage(error));
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
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);
  return (
    <WalletWrapper>
      <ANButton
        type="primary"
        onClick={() => {
          setActivatingConnector(ConnectorNames.Injected);
          activate(
            connectorsByName[ConnectorNames.Injected],
            onWalletConnectionError,
          );
        }}
        label={'Connect Account'}
        height={'48px'}
        width={'178px'}
        disabled={activatingConnector === ConnectorNames.Injected}
      />
    </WalletWrapper>
  );
};

export default Wallet;
