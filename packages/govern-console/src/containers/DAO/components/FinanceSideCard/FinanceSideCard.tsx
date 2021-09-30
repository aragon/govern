import styled, { css } from 'styled-components';
import { useEffect, useMemo, useState } from 'react';
import { useLayout, Button, ButtonText, IconUp, IconDown } from '@aragon/ui';

import BalanceCard from '../BalanceCard/BalanceCard';
import { FinanceToken } from 'utils/types';
import { objectIsEmptyOrUndefined } from 'utils/HelperFunctions';

type Props = {
  tokens: FinanceToken;
  mainToken: string;
};

const Container = styled.div<{ layoutIsSmall: boolean }>`
  gap: 16px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: flex-start;

  border-radius: 12px;
  padding: 24px 16px 16px;
  background-color: #ffffff;

  ${({ layoutIsSmall }) => layoutIsSmall && 'width: 343px'}
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

const FinanceSideCard: React.FC<Props> = ({ tokens, mainToken }) => {
  const [displayAssets, setDisplayAssets] = useState<boolean>(false);

  const { layoutName } = useLayout();
  const layoutIsSmall = useMemo(() => layoutName === 'small', [layoutName]);

  useEffect(() => {
    // Assets shown on medium to large screens
    if (!layoutIsSmall) {
      setDisplayAssets(true);
    }

    if (layoutIsSmall) {
      setDisplayAssets(false);
    }
  }, [layoutIsSmall]);

  if (objectIsEmptyOrUndefined(tokens)) {
    return <div>Loading</div>;
  }

  return (
    <Container layoutIsSmall={layoutIsSmall}>
      <MainTokenBalance>
        <Token>{`${tokens[mainToken].amount} ${tokens[mainToken].symbol}`}</Token>
        <USDValue>~$25,012.57 USD</USDValue>
      </MainTokenBalance>

      {displayAssets && (
        <Assets>
          {Object.values(tokens).map((token: any) => (
            <BalanceCard
              key={token.symbol}
              USDValue={'8,000,000'}
              cryptoValue={token.amount.toString()}
            />
          ))}
        </Assets>
      )}

      {layoutIsSmall && (
        <ButtonGroup>
          <NewTransferButton label="New transfer" />
          <ShowAssetsButton>
            <ButtonTextContainer
              onClick={() => {
                setDisplayAssets(!displayAssets);
              }}
            >
              {`${displayAssets ? 'Close' : 'Show'} ${Object.keys(tokens).length} asset(s)`}

              {/* TODO: This needs to change if transformation is used */}
              {displayAssets ? <IconUp size="small" /> : <IconDown size="small" />}
            </ButtonTextContainer>
          </ShowAssetsButton>
        </ButtonGroup>
      )}
    </Container>
  );
};

export default FinanceSideCard;
