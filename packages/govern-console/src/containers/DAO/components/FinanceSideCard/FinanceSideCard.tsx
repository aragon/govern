import { BigNumber } from 'ethers';
import styled, { css } from 'styled-components';
import { useEffect, useMemo, useState } from 'react';
import { useLayout, Button, ButtonText, IconUp, IconDown } from '@aragon/ui';

import BalanceCard from '../BalanceCard/BalanceCard';
import { toBigNum } from 'utils/lib';
import { useFinanceQuery } from 'hooks/query-hooks';
import { useParams } from 'react-router';

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

const Balance = styled.div`
  gap: 4px;
  display: flex;
  flex-direction: column;
`;

const Crypto = styled.p`
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

type Deposit = {
  _typename: string;
  amount: string;
  id: string;
  sender: string;
  token: string;
};

type Withdraw = {
  id: string;
  to: string;
  from: string;
  token: string;
  amount: string;
  _typename: string;
};

type Balance = {
  [key: string]: bigint;
};

const FinanceSideCard: React.FC = () => {
  const { daoName } = useParams<any>();
  const { data, loading } = useFinanceQuery(daoName);
  const [displayAssets, setDisplayAssets] = useState<boolean>(false);

  const { layoutName } = useLayout();
  const layoutIsSmall = useMemo(() => layoutName === 'small', [layoutName]);

  function mapToBalance(data: any) {
    const balance: Balance = {};
    console.log(data);

    data.deposits.forEach((deposit: Deposit) => {
      if (balance[deposit.token]) {
        balance[deposit.token] += BigInt(deposit.amount);
      } else {
        balance[deposit.token] = BigInt(deposit.amount);
      }
    });

    data.withdraws.forEach((withdraw: Withdraw) => {
      if (balance[withdraw.token]) {
        balance[withdraw.token] -= BigInt(withdraw.amount);
      } else {
        // Should never fall into here
        console.log('Error. What??', withdraw.token);
      }
    });
  }

  useEffect(() => {
    // Assets shown on medium to large screens
    if (!layoutIsSmall) {
      setDisplayAssets(true);
    }

    /**
     * Coming from larger screens, hide assets (back to default
     * for small screens)
     * NOTE: Branch taken only when using console or perhaps a
     * switch from portrait to landscape
     */
    if (layoutIsSmall) {
      setDisplayAssets(false);
    }
  }, [layoutIsSmall]);

  return (
    <Container layoutIsSmall={layoutIsSmall}>
      {!loading && mapToBalance(data)}
      <Balance>
        <Crypto>10.1001323 ETH</Crypto>
        <USDValue>~$25,012.57 USD</USDValue>
      </Balance>

      {displayAssets && (
        <Assets>
          {new Array(4).fill(0).map((_, index) => (
            <BalanceCard key={index} USDValue={'8,000,000'} cryptoValue={'8,000,232'} />
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
              {`${displayAssets ? 'Close' : 'Show'} 4 assets`}
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
