import {
  GU,
  LoadingRing,
  IconConnect,
  IconCheck,
  Button,
  IconRotateLeft,
  IconExternal,
} from '@aragon/ui';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';
import { useCallback, useEffect, useState, useMemo } from 'react';

import { useWallet } from 'providers/AugmentedWallet';
import { useTransferContext } from './TransferContext';
import { CustomTransaction, CustomTransactionStatus } from 'utils/types';

enum SigningState {
  Processing,
  Success,
  Failure,
}

type Props = {
  onClose: () => void;
};

const SignDeposit: React.FC<Props> = ({ onClose }) => {
  // useTransferContext();
  const { getValues } = useFormContext();
  const { networkName } = useWallet();
  const { transactions } = useTransferContext();
  const [txState, setTxState] = useState(SigningState.Processing);
  const [transactionList, setTransactionList] = useState<CustomTransaction[]>([...transactions]);
  // const [errorMessage, setErrorMessage] = useState('');
  const [transactionHash, setTransactionHash] = useState('');

  const {
    reference,
    title,
    depositAmount,
    token: { symbol },
  } = useMemo(() => getValues(), [getValues]);

  useEffect(() => {
    BuildTransaction();

    // Purposefully want this to run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = useCallback(
    (txIndex: number, newStatus: CustomTransactionStatus) => {
      const txs = [...transactions];
      txs[txIndex].status = newStatus;
      setTransactionList(txs);
    },
    [transactions],
  );

  const SendToExplore = useCallback(() => {
    window.open(
      `${
        {
          Rinkeby: 'https://rinkeby.etherscan.io/tx/',
          Mainnet: 'https://etherscan.io/tx/',
        }[networkName] + transactionHash
      }`,
      '_blank',
    );
  }, [networkName, transactionHash]);

  const BuildTransaction = useCallback(async () => {
    let isQueueAborted = false;
    let index = 0;
    for (const tx of transactionList) {
      if (isQueueAborted) return;
      try {
        setTransactionHash('');
        setTxState(SigningState.Processing);
        updateStatus(index, CustomTransactionStatus.InProgress);
        const txResponse = await tx.tx();
        const txReceipt = await txResponse.wait();
        updateStatus(index, CustomTransactionStatus.Successful);
        setTxState(SigningState.Success);
        setTransactionHash(txReceipt.transactionHash);
      } catch (ex: any) {
        isQueueAborted = true;
        updateStatus(index, CustomTransactionStatus.Failed);
        setTxState(SigningState.Failure);
        // setErrorMessage(ex.message);
      }
      index++;
    }
  }, [transactionList, updateStatus]);

  const MessageType = useMemo(() => {
    switch (txState) {
      case SigningState.Processing:
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
      case SigningState.Success:
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
      case SigningState.Failure:
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
  }, [txState, reference, depositAmount, symbol, onClose, SendToExplore, BuildTransaction]);

  return (
    <>
      <HeaderContainer>
        <Title>Sign {title}</Title>
        <Description>To complete your transfer, sign your {title} with your wallet.</Description>
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
