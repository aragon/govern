import styled from 'styled-components';
import { useEffect, useState, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  GU,
  LoadingRing,
  IconConnect,
  IconCheck,
  Button,
  IconRotateLeft,
  IconExternal,
} from '@aragon/ui';
import { useTransferContext } from './TransferContext';
import { CustomTransactionStatus } from 'utils/types';
import { useWallet } from 'providers/AugmentedWallet';

enum TransactionState {
  Processing,
  Success,
  Failure,
}

type Props = {
  onClose: () => void;
};

const SignDeposit: React.FC<Props> = ({ onClose }) => {
  // useTransferContext();
  const { transactions } = useTransferContext();
  const [txState, setTxState] = useState(TransactionState.Processing);
  const [transactionHash, setTransactionHash] = useState('');
  const [transaction, setTransaction] = useState({ ...transactions[0] });
  const [errorMessage, setErrorMessage] = useState('');
  const { networkName } = useWallet();

  const { getValues } = useFormContext();
  const {
    reference,
    depositAmount,
    token: { symbol },
  } = getValues();

  const updateStatus = (status: CustomTransactionStatus) => {
    setTransaction((transaction) => ({ ...transaction, status }));
  };

  const SendToExplore = () => {
    window.open(
      `${
        {
          Rinkeby: 'https://rinkeby.etherscan.io/tx/',
          Mainnet: 'https://etherscan.io/tx/',
        }[networkName] + transactionHash
      }`,
      '_blank',
    );
  };

  async function BuildTransaction() {
    try {
      setTransactionHash('');
      updateStatus(CustomTransactionStatus.InProgress);
      const txResponse = await transaction.tx();
      const txReceipt = await txResponse.wait();
      updateStatus(CustomTransactionStatus.Successful);
      setTxState(TransactionState.Success);
      console.log('checkit', txReceipt);
      setTransactionHash(txReceipt.transactionHash);
    } catch (ex: any) {
      updateStatus(CustomTransactionStatus.Failed);
      setTxState(TransactionState.Failure);
      setErrorMessage(ex.message);
      console.log(ex);
    }
  }

  useEffect(() => {
    BuildTransaction();

    // Purposefully want this to run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const MessageType = useMemo(() => {
    switch (txState) {
      case TransactionState.Processing:
        return (
          <SignCard className="loading">
            <Wrapper>
              <InfoWrapper>
                <LoadingContainer className="loading">
                  <LoadingRing />
                </LoadingContainer>
                <InfoContainer>
                  <InfoTitle>{reference}</InfoTitle>
                  <InfoDescription>Waiting for confirmation ...</InfoDescription>
                </InfoContainer>
              </InfoWrapper>
              <Amount>
                + {depositAmount} {symbol}
              </Amount>
            </Wrapper>
          </SignCard>
        );
      case TransactionState.Success:
        return (
          <SignCard className="success">
            <Wrapper>
              <InfoWrapper>
                <LoadingContainer className="success">
                  <IconCheck />
                </LoadingContainer>
                <InfoContainer>
                  <InfoTitle>{reference}</InfoTitle>
                  <InfoDescription>Transfer successfully signed</InfoDescription>
                </InfoContainer>
              </InfoWrapper>
              <Amount>
                + {depositAmount} {symbol}
              </Amount>
            </Wrapper>
            <SuccessButton label="Close deposit" wide onClick={onClose} />
            <TransparentButton onClick={SendToExplore} wide>
              <p>View on explorer</p>
              <IconExternal />
            </TransparentButton>
          </SignCard>
        );
      case TransactionState.Failure:
        return (
          <SignCard className="failed">
            <Wrapper>
              <InfoWrapper>
                <LoadingContainer className="failed">
                  <IconConnect />
                </LoadingContainer>
                <InfoContainer>
                  <InfoTitle>{reference}</InfoTitle>
                  <InfoDescription>Transfer rejected by wallet</InfoDescription>
                </InfoContainer>
              </InfoWrapper>
              <Amount>
                + {depositAmount} {symbol}
              </Amount>
            </Wrapper>
            <FailedButton wide onClick={BuildTransaction}>
              <p>try again</p>
              <IconRotateLeft />
            </FailedButton>
          </SignCard>
        );
    }
  }, [txState, reference, depositAmount, symbol, BuildTransaction]);

  return (
    <>
      <HeaderContainer>
        <Title>Sign deposit</Title>
        <Description>To complete your transfer, sign your deposit with your wallet.</Description>
      </HeaderContainer>
      {MessageType}
    </>
  );
};

export default SignDeposit;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${3 * GU}px;
`;

const Title = styled.p`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
`;

const Description = styled.p`
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #7483ab;
`;

const SignCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #ffffff;
  border-radius: 12px;
  border: solid 2px #00c2ff;

  &.loading {
    border: solid 2px #00c2ff;
  }
  &.success {
    border: solid 2px #3cce6e;
  }
  &.failed {
    border: solid 2px #ff575c;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  border-radius: 8px;

  &.loading {
    background: #f0fbff;
  }
  &.success {
    background: #effbf3;
    color: #3cce6e;
  }
  &.failed {
    background: #ffe0e1;
    color: #ff575c;
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
}
`;

const InfoWrapper = styled.div`
  display: flex;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: ${2 * GU}px;
`;

const InfoTitle = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
`;

const InfoDescription = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 150%;
  color: #7483ab;
`;

const Amount = styled.p`
  display: flex;
  font-size: 16px;
  font-weight: 600;
  color: #20232c;
`;

const SuccessButton = styled(Button)`
  background: #effbf3;
  color: #3cce6e;
  box-shadow: none;
  margin-top: 16px;
  height: 40px;

  &:hover {
    background: #effbf3;
  }
`;

const FailedButton = styled(Button)`
  background: #ffe0e1;
  color: #ff575c;
  box-shadow: none;
  margin-top: 16px;
  height: 40px;
  &:hover {
    background: #ffe0e1;
  }
`;

const TransparentButton = styled(Button)`
  background: transparent;
  color: #00c2ff;
  margin-top: 16px;
  height: 40px;
  box-shadow: none;
  &:hover {
    background: transparent;
  }
`;
