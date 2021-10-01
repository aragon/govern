import styled from 'styled-components';
import { constants } from 'ethers';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, GU, Grid, GridItem, useLayout, IconDown } from '@aragon/ui';

import { useWallet } from 'providers/AugmentedWallet';
import { formatUnits } from 'utils/lib';
import FinanceSideCard from './components/FinanceSideCard/FinanceSideCard';
import DaoTransferModal from './DaoTransferModal';
import { getTokenInfo } from 'utils/token';
import DaoTransactionCard from './components/DaoTransactionCard/DaoTransactionCard';
import { useFinanceQuery } from 'hooks/query-hooks';
import { getMigrationBalances } from 'services/finances';
import { Deposit, FinanceToken, Withdraw } from 'utils/types';

type Props = {
  executorId: string;
  token: string;
};

type MigrationResponse = {
  amount: string;
  price: string;
  asset: {
    address: string;
    symbol: string;
    decimals: string;
  };
};

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: ${3 * GU}px;
`;

const Title = styled.p`
  font-weight: 600;
  font-size: 28px;
  line-height: 125%;
`;

const CustomActionButton = styled(Button)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 24px;
  width: 134px;
  height: 44px;
  border-radius: 12px;
  box-shadow: none;
`;

const TransactionListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: ${3 * GU}px;
`;

const ListTitle = styled.p`
  font-weight: 600;
  font-size: 20px;
  line-height: 125%;
  margin-bottom: 16px;
`;

const LoadMoreButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 24px;
  width: 154px;
  height: 44px;
  border-radius: 12px;
  color: #7483ab;
  background: #ffffff;
  box-shadow: none;
  cursor: pointer;
  & > svg {
    padding-left: 2px;
  }
`;

const DaoFinancePage: React.FC<Props> = ({ executorId, token: mainToken }) => {
  const { provider } = useWallet();
  const [tokens, setTokens] = useState<FinanceToken>({});
  const [opened, setOpened] = useState<boolean>(false);
  const { data: finances, loading: isLoading } = useFinanceQuery(executorId);

  const { layoutName } = useLayout();
  const layoutIsSmall = useMemo(() => layoutName === 'small', [layoutName]);

  useEffect(() => {
    if (!isLoading && finances) {
      prepareTokens();
    }

    async function getCurrentBalances(balances: FinanceToken) {
      // No deposits still show main balance as 0
      if (finances.deposits.length === 0) {
        const { decimals, symbol } = await getTokenInfo(mainToken, provider);
        balances[mainToken] = {
          amount: BigInt(0),
          amountForHuman: formatUnits(0, decimals),
          symbol,
          decimals,
        };
      }

      // Add all deposits
      let currentToken: string;
      finances.deposits.forEach(async ({ token: depositToken, amount }: Deposit) => {
        currentToken = depositToken === constants.AddressZero ? mainToken : depositToken;

        if (balances[currentToken]) {
          balances[currentToken].amount += BigInt(amount);
          balances[currentToken].amountForHuman = formatUnits(
            balances[currentToken].amount,
            +balances[currentToken].decimals,
          );
        } else {
          const { decimals, symbol } = await getTokenInfo(currentToken, provider);
          balances[currentToken] = {
            amount: BigInt(amount),
            amountForHuman: formatUnits(amount, decimals),
            symbol,
            decimals,
            // TODO: get Price
          };
        }
      });

      // Subtract all withdraws
      finances.withdraws.forEach(({ token: depositToken, amount }: Withdraw) => {
        currentToken = depositToken === constants.AddressZero ? mainToken : depositToken;

        if (balances[currentToken]) {
          balances[currentToken].amount -= BigInt(amount);
          balances[currentToken].amountForHuman = formatUnits(
            balances[currentToken].amount,
            +balances[currentToken].decimals,
          );
        }
      });
      setTokens(balances);
    }

    async function prepareTokens() {
      // Get migrated assets if any
      const balances: FinanceToken = {};
      const data = await getMigrationBalances(executorId);
      data?.forEach(
        ({ amount, price, asset: { address, symbol, decimals } }: MigrationResponse) => {
          balances[address] = {
            amount: BigInt(amount),
            amountForHuman: formatUnits(amount, +decimals),
            symbol,
            decimals: Number(decimals),
            price,
          };
        },
      );

      // Get subgraph balances
      await getCurrentBalances(balances);
    }
  }, [finances, isLoading, provider, mainToken, executorId]);

  const open = () => setOpened(true);
  const close = () => setOpened(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Grid gap={24} columns="9">
      <GridItem gridColumn={layoutIsSmall ? '1/-1' : '7/10'}>
        <FinanceSideCard tokens={tokens} mainToken={mainToken} onNewTransfer={open} />
      </GridItem>
      <GridItem
        gridRow={layoutIsSmall ? '2/-1' : '1/2'}
        gridColumn={layoutIsSmall ? '1/-1' : '1/7'}
      >
        <div>
          {!layoutIsSmall && (
            <HeaderContainer>
              <Title>Finance</Title>
              <CustomActionButton label="New Transfer" onClick={open} />
            </HeaderContainer>
          )}
          <TransactionListContainer>
            <ListTitle>Transactions</ListTitle>
            <DaoTransactionCard />
          </TransactionListContainer>
          <LoadMoreButton>
            <span>Load more</span>
            <IconDown />
          </LoadMoreButton>
          <DaoTransferModal opened={opened} close={close} />
        </div>
      </GridItem>
    </Grid>
  );
};

export default DaoFinancePage;
