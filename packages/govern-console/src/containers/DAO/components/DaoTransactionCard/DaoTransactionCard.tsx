import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import { useMemo } from 'react';
import { Box, IconDeposit, IconWithdraw, useLayout } from '@aragon/ui';

import { formatDate } from 'utils/date';
import { Transaction } from 'utils/types';
type Props = {
  info?: Transaction;
};

const ActionCard = styled(Box).attrs(() => ({
  padding: 16,
}))`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  border-radius: 16px;
  width: 100%;
  border: none;
  & > div {
    width: 100%;
  }
  & > div > div {
    display: flex;
    justify-content: space-between;
    align-items: start;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Text = styled.p`
  font-weight: 600;
  font-size: 16px;
  line-height: 125%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  // max-width: 150px;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  margin-right: 16px;
  color: #7483ab;

  &.deposit {
    background: #e7f9ed;
    color: #218242;
  }
  &.withdraw {
    background: #fff9f0;
    color: #ffb53a;
  }
  &.failed_withdraw {
    background: #fff0f0;
    color: #ff575c;
  }
  &.pending {
    background: #f0fbff;
    color: #00c2ff;
  }
`;

const Time = styled.p`
  font-weight: 500;
  font-size: 14px;
  line-height: 150%;
  color: #7483ab;
  margin-top: 4px;
`;

const PriceContainer = styled.div`
  display: flex;
  font-weight: 600;
  font-size: 16px;

  &.deposit {
    color: #218242;
  }
  &.withdraw {
    color: #ffb53a;
  }
  &.failed_withdraw {
    color: #20232c;
  }
  &.pending {
    color: #20232c;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex: 1;
`;

const StyledSkeleton = styled(Skeleton).attrs(() => ({ style: { borderRadius: '8px' } }))``;

const DaoTransactionCard: React.FC<Props> = ({ info }) => {
  const { layoutName } = useLayout();
  const isDeposit = useMemo(() => info?.typename.toLowerCase() === 'deposit', [info?.typename]);

  const Icon = useMemo(() => {
    if (!info?.typename) {
      return <StyledSkeleton width={32} height={32} />;
    }
    return isDeposit ? <IconDeposit /> : <IconWithdraw />;
  }, [info?.typename, isDeposit]);

  const Price = useMemo(() => {
    if (!info?.amount || !info?.symbol) {
      return <StyledSkeleton height={20} width={80} />;
    }

    return `${isDeposit ? '+' : '-'} ${info?.amount} ${info?.symbol}`;
  }, [info?.amount, info?.symbol, isDeposit]);

  return (
    <ActionCard>
      <InfoContainer>
        <IconContainer className={info?.typename.toLowerCase()}>{Icon}</IconContainer>
        <TextContainer>
          <Text>
            {info?.typename ? (
              info.typename
            ) : (
              <StyledSkeleton height={20} width={layoutName === 'small' ? 150 : 250} />
            )}
          </Text>
          <Time>
            {info?.createdAt ? (
              formatDate(info?.createdAt, 'relative')
            ) : (
              <StyledSkeleton height={20} width={96} />
            )}
          </Time>
        </TextContainer>
      </InfoContainer>
      <PriceContainer className={info?.typename.toLowerCase()}>{Price}</PriceContainer>
    </ActionCard>
  );
};

export default DaoTransactionCard;
// info?.typename ? (
//   info.typename.toLowerCase() === 'deposit' ? (
//     <IconDownload />
//   ) : (
//     <IconUpload />
//   )
// ) : (
//   <Skeleton />
// )
