import styled from 'styled-components';
import { memo, useState } from 'react';

type Props = {
  usd: string;
  icon: string;
  token: string;
  symbol: string;
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

const FallbackIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 32px;
  background: linear-gradient(107.79deg, #00c2ff 1.46%, #01e8f7 100%);
`;

const BalanceCard: React.FC<Props> = ({ icon, token, usd, symbol }) => {
  const [error, setError] = useState<boolean>(false);

  return (
    <Container>
      <IconContainer>
        {error ? (
          <FallbackIcon />
        ) : (
          <Icon src={icon} alt="token logo" onError={() => setError(true)} />
        )}
      </IconContainer>

      <Balance>
        <Crypto>{`${token} ${symbol}`}</Crypto>
        <USDEquivalent>{usd ? `~${usd} USD` : 'USD value unknown'}</USDEquivalent>
      </Balance>
    </Container>
  );
};

const MemoizedBalanceCard = memo(BalanceCard);
export default MemoizedBalanceCard;
