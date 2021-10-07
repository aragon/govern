import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { GU, LoadingRing } from '@aragon/ui';
import { useTransferContext } from './TransferContext';
import { CustomTransactionStatus } from 'utils/types';

enum TransactionState {
  Processing,
  Success,
  Failure,
}

const SignDeposit: React.FC = () => {
  // useTransferContext();
  const { transactions } = useTransferContext();
  const [txState, setTxState] = useState(TransactionState.Processing);
  const [transaction, setTransaction] = useState({ ...transactions[0] });
  const [errorMessage, setErrorMessage] = useState('');

  const { getValues } = useFormContext();
  const {
    reference,
    depositAmount,
    token: { symbol },
  } = getValues();

  const updateStatus = (status: CustomTransactionStatus) => {
    setTransaction((transaction) => ({ ...transaction, status }));
  };

  useEffect(() => {
    (async () => {
      try {
        updateStatus(CustomTransactionStatus.InProgress);
        const txResponse = await transaction.tx();
        const txReceipt = await txResponse.wait();
        updateStatus(CustomTransactionStatus.Successful);
        setTxState(TransactionState.Success);
        console.log(transaction, txReceipt);
      } catch (ex: any) {
        updateStatus(CustomTransactionStatus.Failed);
        setTxState(TransactionState.Failure);
        setErrorMessage(ex.message);
        console.log(ex);
      }
    })();

    // Purposefully want this to run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <HeaderContainer>
        <Title>Sign deposit</Title>
        <Description>To complete your transfer, sign your deposit with your wallet.</Description>
      </HeaderContainer>
      <SignCard>
        <Wrapper>
          <LoadingContainer>
            <LoadingRing />
          </LoadingContainer>
          <InfoContainer>
            <InfoTitle>{reference}</InfoTitle>
            <InfoDescription>Waiting for confirmation ...</InfoDescription>
          </InfoContainer>
        </Wrapper>
        <Amount>
          + ${depositAmount} ${symbol}
        </Amount>
      </SignCard>
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
  justify-content: space-between;
  padding: 16px;
  background: #ffffff;
  border-radius: 12px;
  border: solid 2px #00c2ff;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  background: #f0fbff;
  border-radius: 8px;
`;

const Wrapper = styled.div`
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
