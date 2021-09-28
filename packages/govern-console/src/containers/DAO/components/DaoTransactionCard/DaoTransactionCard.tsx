import styled from 'styled-components';
import { Box, IconDownload, useLayout } from '@aragon/ui';
import { formatDate } from 'utils/date';

type Props = {
  date: string;
  state: string;
  title: string | null;
};

const ActionCard = styled(Box).attrs(() => ({
  padding: 16,
}))`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  border-radius: 16px;
  width: 100%;
  border: none;
  cursor: pointer;
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
  max-width: 150px;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  margin-right: 16px;
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
`;

const DaoTransactionCard: React.FC = () => {
  const { layoutName } = useLayout();

  return (
    <ActionCard>
      <InfoContainer>
        <IconContainer className="deposit">
          <IconDownload />
        </IconContainer>
        <TextContainer>
          <Text
            css={`
              width: ${layoutName === 'small' ? '100px' : '250px'};
            `}
          >
            Deposit
          </Text>
          <Time>Yesterday</Time>
        </TextContainer>
      </InfoContainer>
      <PriceContainer className="deposit">+5,000 USDT</PriceContainer>
    </ActionCard>
  );
};

export default DaoTransactionCard;
