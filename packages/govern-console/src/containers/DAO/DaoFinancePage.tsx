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
import { ASSET_ICON_BASE_URL } from 'utils/constants';
import { getMigrationBalances, getTokenPrice } from 'services/finances';
import { Balance, Deposit, FinanceToken, Withdraw, Transaction } from 'utils/types';

type Props = {
  executorId: string;
  token: string;
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [opened, setOpened] = useState<boolean>(false);
  const { data: finances, loading: isLoading } = useFinanceQuery(executorId);

  const { layoutName } = useLayout();
  const layoutIsSmall = useMemo(() => layoutName === 'small', [layoutName]);

  useEffect(() => {
    if (!isLoading && finances) {
      getCurrentBalances();
      prepareTransactions();
    }

    // TODO: Potentially refactor to avoid setting state often
    async function getCurrentBalances() {
      const balances: Balance = getMigrationBalances(executorId);
      let deposit: Deposit;
      let address: string;
      for (deposit of finances.deposits) {
        address = deposit.token;
        // if new asset
        if (address in balances === false) {
          const { symbol, decimals } = await getTokenInfo(address, provider);

          balances[address] = {
            amount: BigInt(deposit.amount),
            symbol,
            decimals,
          };
          continue;
        }

        // add to previous amount
        balances[address].amount += BigInt(deposit.amount);
      }

      // No transactions yet using main dao token
      if (mainToken in balances == false) {
        const { symbol, decimals } = await getTokenInfo(mainToken, provider);
        balances[mainToken] = {
          amount: BigInt(0),
          symbol,
          decimals,
        };
      }

      // Ignore eth TODO: more info needed
      if (constants.AddressZero in balances) {
        delete balances[constants.AddressZero];
      }

      let withdraw: Withdraw;
      for (withdraw of finances.withdraws) {
        address = withdraw.token;
        if (address in balances) {
          balances[address].amount -= BigInt(withdraw.amount);
        }
      }

      // Populate with price, human friendly amount and image
      for (address in balances) {
        const response = await getTokenPrice(address);
        setTokens((prevState) => {
          return {
            ...prevState,
            [address]: {
              ...balances[address],
              amountForHuman: formatUnits(balances[address].amount, balances[address].decimals),
              price: response?.price,
              icon: `${ASSET_ICON_BASE_URL}/${address}/logo.png`,
            },
          };
        });
      }
    }

    function sortTransaction(a: Transaction, b: Transaction) {
      return parseInt(b.createdAt) - parseInt(a.createdAt);
    }

    async function prepareTransactions() {
      [...finances.withdraws, ...finances.deposits].map(
        async ({ createdAt, typename, amount, token: currentToken }) => {
          const { decimals, symbol } =
            currentToken === constants.AddressZero
              ? await getTokenInfo(mainToken, provider)
              : await getTokenInfo(currentToken, provider);
          setTransactions((prevState: any) => {
            return [
              ...prevState,
              {
                createdAt,
                typename,
                token: currentToken,
                symbol,
                amount: formatUnits(amount, decimals),
              },
            ].sort(sortTransaction);
          });
        },
      );
    }
  }, [finances, isLoading, provider, mainToken, executorId]);

  const RenderTransactionCard = () => {
    const temp: React.ReactElement[] = [];
    transactions.map((data, index) => {
      temp.push(<DaoTransactionCard info={data} key={index} />);
    });
    return temp;
  };

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
            {RenderTransactionCard()}
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
