import styled, { css } from 'styled-components';
import { useEffect, useMemo, useState } from 'react';
import { useLayout, Button, ButtonText, IconUp, IconDown } from '@aragon/ui';
import { constants } from 'ethers';

import BalanceCard from '../BalanceCard/BalanceCard';
import { useWallet } from 'providers/AugmentedWallet';
import { getTokenInfo } from 'utils/token';
import { Deposit, Withdraw } from 'utils/types';

type Transfers = {
  deposits: Deposit[];
  withdraws: Withdraw[];
  token: string;
};

type Props = {
  transfers: Transfers;
};

type Balance = {
  [key: string]: bigint;
};

type PreparedBalance = {
  [key: string]: {
    decimals: number;
    symbol: string;
    amount: bigint;
  };
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

const FinanceSideCard: React.FC<Props> = ({ transfers }) => {
  const { provider } = useWallet();
  const [balances, setBalances] = useState<PreparedBalance>({});
  const [displayAssets, setDisplayAssets] = useState<boolean>(false);

  const { layoutName } = useLayout();
  const layoutIsSmall = useMemo(() => layoutName === 'small', [layoutName]);

  useEffect(() => {
    function mapTransfersToBalance(data: Transfers) {
      const balance: Balance = {};

      // TODO: get migration transfers from v2

      // Add all deposits from subgraph
      data.deposits?.forEach((deposit: Deposit) => {
        if (balance[deposit.token]) {
          balance[deposit.token] += BigInt(deposit.amount);
        } else {
          balance[deposit.token] = BigInt(deposit.amount);
        }
      });

      // Remove all withdraws from subgraph
      data.withdraws?.forEach((withdraw: Withdraw) => {
        if (balance[withdraw.token]) {
          balance[withdraw.token] -= BigInt(withdraw.amount);
        } else {
          // Should never fall into here
          console.log('Error. What??', withdraw.token);
        }
      });

      // Switch zero address to actual token
      // TODO: check if zero address is on there
      delete Object.assign(balance, { [data.token]: balance[constants.AddressZero] })[
        constants.AddressZero
      ];

      return balance;
    }

    async function prepareTokens(balance: Balance) {
      const preparedTokens: PreparedBalance = {};

      // get and map token info as well as price
      Object.keys(balance).map(async (address: string) => {
        const { decimals, symbol } = await getTokenInfo(address, provider);
        preparedTokens[address] = { decimals, symbol, amount: balance[address] };
      });

      setBalances(preparedTokens);
    }

    prepareTokens(mapTransfersToBalance(transfers));
  }, [transfers, provider]);

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
      <MainTokenBalance>
        <Crypto>10.1001323 ETH</Crypto>
        <USDValue>~$25,012.57 USD</USDValue>
      </MainTokenBalance>

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
