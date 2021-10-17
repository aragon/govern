import { memo } from 'react';
import Skeleton from 'react-loading-skeleton';
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
  width: 100%;
`;

const StyledSkeleton = styled(Skeleton).attrs(() => ({ style: { borderRadius: '8px' } }))``;

const Token = styled.p`
  font-size: 24px;
  font-weight: 600;
  line-height: 30px;
  width: 240px;
`;

const USDValue = styled.p`
  color: #7483ab;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  width: 160px;
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

const Assets = styled.div<{ isVisible: boolean }>`
  width: 100%;
  ${({ isVisible }) => (isVisible ? '' : 'display: none')}
`;

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const FinanceSideCard: React.FC<Props> = ({ tokens, mainToken, onNewTransfer }) => {
  const [displayAssets, setDisplayAssets] = useState<boolean>(false);

  const { layoutName } = useLayout();
  const layoutIsSmall = useMemo(() => layoutName === 'small', [layoutName]);

  const { symbol, amount, price, numberOfAssets } = useMemo(() => {
    return {
      amount: tokens[mainToken]?.amountForHuman,
      symbol: tokens[mainToken]?.symbol,
      price: tokens[mainToken]?.price,
      numberOfAssets: Object.keys(tokens).length,
    };
  }, [tokens, mainToken]);

  const USDPrice = useMemo(() => {
    return price ? `~${formatter.format(Number(price) * Number(amount))} USD` : 'USD value unknown';
  }, [amount, price]);

  useEffect(() => {
    // Assets shown on medium to large screens
    if (!layoutIsSmall) setDisplayAssets(true);
    else setDisplayAssets(false);
  }, [layoutIsSmall]);

  function sortAssets(asset: any, nextAsset: any) {
    return asset.symbol > nextAsset.symbol ? 1 : -1;
  }
  `${amount} ${symbol}`;
  return (
    <Container>
      <MainTokenBalance>
        <Token>{amount && symbol ? `${amount} ${symbol}` : <StyledSkeleton height={30} />}</Token>
        <USDValue>{symbol ? USDPrice : <StyledSkeleton height={24} />}</USDValue>
      </MainTokenBalance>

      <Assets isVisible={displayAssets}>
        {Object.values(tokens)
          .sort(sortAssets)
          .map((token: any, index: number) => (
            <BalanceCard
              key={token.symbol + index}
              usd={
                token.price && formatter.format(Number(token.price) * Number(token.amountForHuman))
              }
              token={token.amountForHuman}
              symbol={token.symbol}
              icon={token.icon}
            />
          ))}
      </Assets>

      {layoutIsSmall && (
        <ButtonGroup>
          <NewTransferButton label="New transfer" onClick={onNewTransfer} />
          <ShowAssetsButton>
            <ButtonTextContainer
              onClick={() => {
                setDisplayAssets(!displayAssets);
              }}
            >
              {`${displayAssets ? 'Close' : 'Show'} ${
                numberOfAssets !== 1 ? `${numberOfAssets} assets` : `asset`
              }`}
              {displayAssets ? <IconUp size="small" /> : <IconDown size="small" />}
            </ButtonTextContainer>
          </ShowAssetsButton>
        </ButtonGroup>
      )}
    </Container>
  );
};

const MemoizedFinanceCard = memo(FinanceSideCard);
export default MemoizedFinanceCard;
