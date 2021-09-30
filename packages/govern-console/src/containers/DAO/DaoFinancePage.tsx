import styled from 'styled-components';
import { constants } from 'ethers';
import React, { useEffect, useState } from 'react';
import { Button, GU, useLayout, IconDown } from '@aragon/ui';

import { useWallet } from 'providers/AugmentedWallet';
import { formatUnits } from 'utils/lib';
import FinanceSideCard from './components/FinanceSideCard/FinanceSideCard';
import DaoTransferModal from './DaoTransferModal';
import { getTokenInfo } from 'utils/token';
import DaoTransactionCard from './components/DaoTransactionCard/DaoTransactionCard';
import { useFinanceQuery } from 'hooks/query-hooks';
import { Deposit, FinanceToken, Withdraw } from 'utils/types';

type Props = {
  executorId: string;
  token: string;
};

type Balance = {
  [key: string]: bigint;
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

const DaoFinancePage: React.FC<Props> = ({ executorId, token }) => {
  const { provider } = useWallet();
  const [tokens, setTokens] = useState<FinanceToken>({});
  const { data: finances, loading: isLoading } = useFinanceQuery(executorId);

  const { layoutName } = useLayout();
  const [opened, setOpened] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading && finances) {
      prepareTokens(sumBalances());
    }

    function sumBalances() {
      const balances: Balance = {};

      // No deposits still show main balance as 0
      if (finances.deposits.length == 0) {
        Object.assign(balances, {
          [token]: BigInt(0),
        });
        return balances;
      }

      // TODO: Get migration data

      // Add all deposits from subgraph
      finances.deposits.forEach((deposit: Deposit) => {
        if (balances[deposit.token]) {
          balances[deposit.token] += BigInt(deposit.amount);
        } else {
          balances[deposit.token] = BigInt(deposit.amount);
        }
      });

      // Remove all withdraws from subgraph
      finances.withdraws.forEach((withdraw: Withdraw) => {
        if (balances[withdraw.token]) {
          balances[withdraw.token] -= BigInt(withdraw.amount);
        }
      });

      // Switch zero address to actual token
      if (balances[constants.AddressZero]) {
        Object.assign(balances, {
          [token]: balances[constants.AddressZero],
        });

        delete balances[constants.AddressZero];
      }

      return balances;
    }

    async function prepareTokens(balances: Balance) {
      Object.keys(balances).forEach(async (tokenAddress: string) => {
        const { decimals, symbol } = await getTokenInfo(tokenAddress, provider);
        console.log(decimals, symbol, balances[tokenAddress]);

        // TODO: get icons

        // Forced to set state like a savage so that rerenders are forced
        // and proper props are passed to the children
        setTokens((prevState) => {
          return {
            ...prevState,
            [tokenAddress]: {
              decimals,
              symbol,
              amount: formatUnits(balances[tokenAddress], decimals),
            },
          };
        });
      });
    }
  }, [finances, isLoading, provider, token]);

  console.log('finances', finances);

  const open = () => setOpened(true);
  const close = () => setOpened(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <HeaderContainer>
        <Title>Finance</Title>
        <CustomActionButton label="New Transfer" onClick={open} />
      </HeaderContainer>
      <TransactionListContainer>
        <ListTitle>Transactions</ListTitle>
        <DaoTransactionCard />
      </TransactionListContainer>
      <LoadMoreButton>
        <span>Load more</span>
        <IconDown />
      </LoadMoreButton>
      <DaoTransferModal opened={opened} close={close} />
      <FinanceSideCard tokens={tokens} mainToken={token} />
    </div>
  );
};

export default DaoFinancePage;
