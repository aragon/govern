import styled, { css } from 'styled-components';
import { useEffect, useMemo, useState } from 'react';
import { useLayout, Button, ButtonText, IconUp, IconDown } from '@aragon/ui';

import BalanceCard from '../BalanceCard/BalanceCard';
import { FinanceToken } from 'utils/types';

type Props = {
  tokens: FinanceToken;
  mainToken: string;
  onNewTransfer: () => void;
};

const Container = styled.div`
  gap: 16px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 12px;
  padding: 24px 16px 16px;
  background-color: #ffffff;
`;

const MainTokenBalance = styled.div`
  gap: 4px;
  display: flex;
  flex-direction: column;
`;

const Token = styled.p`
  font-size: 24px;
  font-weight: 600;
  line-height: 30px;
`;

const USDValue = styled.p`
  color: #7483ab;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
`;

const ButtonGroup = styled.div`
  width: 100%;
  gap: 16px;
  display: flex;
`;

const ButtonTextStyle = css`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
`;

const NewTransferButton = styled(Button)`
  flex: 1;
  height: 40px;
  box-shadow: none;

  ${ButtonTextStyle}
`;

const ShowAssetsButton = styled(ButtonText)`
  flex: 1;
  color: #00c2ff;
  height: 40px;

  ${ButtonTextStyle}
`;

const ButtonTextContainer = styled.div`
  gap: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Assets = styled.div`
  width: 100%;
`;

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

// TODO: set default props to remove memo
const FinanceSideCard: React.FC<Props> = ({ tokens, mainToken, onNewTransfer }) => {
  const [displayAssets, setDisplayAssets] = useState<boolean>(false);

  const { layoutName } = useLayout();
  const layoutIsSmall = useMemo(() => layoutName === 'small', [layoutName]);
  const { symbol, amount, price } = useMemo(() => {
    return {
      amount: tokens[mainToken]?.amountForHuman || 0.0,
      symbol: tokens[mainToken]?.symbol || 'Tokens',
      price: tokens[mainToken]?.usd,
    };
  }, [tokens, mainToken]);

  useEffect(() => {
    // Assets shown on medium to large screens
    if (!layoutIsSmall) {
      setDisplayAssets(true);
    }

    if (layoutIsSmall) {
      setDisplayAssets(false);
    }
  }, [layoutIsSmall]);

  return (
    <Container>
      <MainTokenBalance>
        <Token>{`${amount} ${symbol}`}</Token>
        {price && <USDValue>{`~${formatter.format(Number(price) * Number(amount))} USD`}</USDValue>}
      </MainTokenBalance>

      {displayAssets && (
        <Assets>
          {Object.values(tokens).map((token: any) => (
            <BalanceCard
              key={token.symbol}
              usd={
                token.price && formatter.format(Number(token.price) * Number(token.amountForHuman))
              }
              token={token.amountForHuman}
              symbol={token.symbol}
            />
          ))}
        </Assets>
      )}

      {layoutIsSmall && (
        <ButtonGroup>
          <NewTransferButton label="New transfer" onClick={onNewTransfer} />
          <ShowAssetsButton>
            <ButtonTextContainer
              onClick={() => {
                setDisplayAssets(!displayAssets);
              }}
            >
              {`${displayAssets ? 'Close' : 'Show'} ${Object.keys(tokens).length} asset(s)`}
              {displayAssets ? <IconUp size="small" /> : <IconDown size="small" />}
            </ButtonTextContainer>
          </ShowAssetsButton>
        </ButtonGroup>
      )}
    </Container>
  );
};

export default FinanceSideCard;
