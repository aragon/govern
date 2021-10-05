import { memo } from 'react';
import styled from 'styled-components';

import ETHIcon from 'images/pngs/eth_logo.png';

type Props = {
  token: string;
  usd: string;
  symbol: string;
  icon: string;
};

const Container = styled.div`
  gap: 16px;
  display: flex;
  align-items: center;
  padding: 12px 0px;
  border-top: 1px solid #eff1f7;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
`;

const Balance = styled.div`
  flex: 1;
  gap: 4px;
  display: flex;
  flex-direction: column;
`;

const Crypto = styled.p`
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
`;

const USDEquivalent = styled.p`
  color: #7483ab;
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
`;

const BalanceCard: React.FC<Props> = ({ icon, token, usd, symbol }) => {
  return (
    <Container>
      <IconContainer>
        <Icon
          src={icon || ETHIcon}
          alt="token logo"
          onError={(e: any) => {
            e.target.onerror = null;
            e.target.src = ETHIcon;
          }}
        />
      </IconContainer>
      <Balance>
        <Crypto>{`${token} ${symbol}`}</Crypto>
        {usd && <USDEquivalent>{`~${usd} USD`}</USDEquivalent>}
      </Balance>
    </Container>
  );
};

const MemoizedBalanceCard = memo(BalanceCard);
export default MemoizedBalanceCard;
