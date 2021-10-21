import styled from 'styled-components';
import { SkeletonTheme } from 'react-loading-skeleton';
import { constants } from 'ethers';
import { Button, GU, Grid, GridItem, useLayout, useToast } from '@aragon/ui';
import React, { useEffect, useMemo, useState, useCallback } from 'react';

import { ETH } from 'utils/Asset';
import { Error } from 'utils/Error';
import { useWallet } from 'providers/AugmentedWallet';
import NoResultFound from './components/NoResultFound/NoResultFound';
import { formatUnits } from 'utils/lib';
import FinanceSideCard from './components/FinanceSideCard/FinanceSideCard';
import DaoTransferModal from './DaoTransferModal';
import { getTokenInfo } from 'utils/token';
import DaoTransactionCard from './components/DaoTransactionCard/DaoTransactionCard';
import { useFinanceQuery } from 'hooks/query-hooks';
import { ASSET_ICON_BASE_URL } from 'utils/constants';
import { trackEvent, EventType } from 'services/analytics';
import { getMigrationBalances, getTokenPrice } from 'services/finances';
import { Balance, Deposit, FinanceToken, Withdraw, Transaction } from 'utils/types';

type Props = {
  token: string;
  daoName: string;
  executorId: string;
};

const SideCard = styled(GridItem).attrs(({ layoutIsSmall, isMediumPortrait }) => {
  let row = layoutIsSmall ? '1/2' : '1/3';
  let column = layoutIsSmall ? '1/-1' : '5/6';

  if (isMediumPortrait) {
    row = '2/3';
    column = '1/7';
  }

  return { gridRow: row, gridColumn: column };
})``;

const ListContainer = styled(GridItem).attrs(({ layoutIsSmall, isMediumPortrait }) => {
  let row = layoutIsSmall ? '2/-1' : '2/3';
  let column = layoutIsSmall ? '1/-1' : '1/5';

  if (isMediumPortrait) {
    row = '3/4';
    column = '1/7';
  }

  return { gridRow: row, gridColumn: column };
})``;

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

const DaoFinancePage: React.FC<Props> = ({ executorId, daoName, token: mainToken }) => {
  const toast = useToast();
  const { layoutName } = useLayout();

  const { provider, isConnected } = useWallet();
  const { data: finances, loading: isLoading } = useFinanceQuery(executorId);

  const [tokens, setTokens] = useState<FinanceToken>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState<boolean>(false);

  // TODO: Future refactor - extract both isSmall and isMediumPortrait into one hook
  const layoutIsSmall = useMemo(() => layoutName === 'small', [layoutName]);
  const checkIfMediumPortrait = useCallback(
    () => layoutName === 'medium' && /portrait/.test(window.screen.orientation.type),
    [layoutName],
  );

  const [isMediumPortrait, updateIsMediumPortrait] = useState<boolean>(() =>
    checkIfMediumPortrait(),
  );

  const setMediumPortrait = useCallback(() => {
    updateIsMediumPortrait(checkIfMediumPortrait);
  }, [checkIfMediumPortrait]);

  useEffect(() => {
    window.addEventListener('resize', setMediumPortrait);
    return () => window.removeEventListener('resize', setMediumPortrait);
  }, [setMediumPortrait]);

  useEffect(() => {
    if (!isLoading && finances) {
      getCurrentBalances();
      prepareTransactions();
    }

    async function getCurrentBalances() {
      const balances: Balance = { ...getMigrationBalances(executorId) };
      let deposit: Deposit;
      let address: string;

      for (deposit of finances.deposits) {
        address = deposit.token;
        // if new asset
        if (!balances.hasOwnProperty(address)) {
          const { symbol, decimals } = await getTokenInfo(address, provider);

          balances[address] = {
            amount: BigInt(deposit.amount),
            symbol: symbol || 'ETH',
            decimals: decimals || 18,
          };
          continue;
        }

        // add to previous amount
        balances[address].amount += BigInt(deposit.amount);
      }

      if (!balances.hasOwnProperty(ETH.address)) {
        balances[ETH.address] = {
          amount: BigInt(0),
          symbol: ETH.symbol,
          decimals: ETH.decimals,
        };
      }

      // No transactions yet using main dao token
      if (!balances.hasOwnProperty(mainToken)) {
        const { symbol, decimals } = await getTokenInfo(mainToken, provider);
        balances[mainToken] = {
          amount: BigInt(0),
          symbol,
          decimals,
        };
      }

      let withdraw: Withdraw;
      for (withdraw of finances.withdraws) {
        address = withdraw.token;
        if (balances.hasOwnProperty(address)) {
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

    // Sort based on date
    function sortTransaction(a: Transaction, b: Transaction) {
      return parseInt(b.createdAt) - parseInt(a.createdAt);
    }

    // Create List for Showing List of transaction
    async function prepareTransactions() {
      setTransactions([]);
      [...finances.withdraws, ...finances.deposits].map(
        async ({ createdAt, typename, amount, reference, token: currentToken }) => {
          const { decimals, symbol } =
            currentToken === constants.AddressZero
              ? { symbol: 'ETH', decimals: 18 }
              : await getTokenInfo(currentToken, provider);
          setTransactions((prevState: any) => {
            return [
              ...prevState,
              {
                createdAt,
                typename,
                token: currentToken,
                reference,
                symbol,
                amount: formatUnits(amount, decimals),
              },
            ].sort(sortTransaction);
          });
        },
      );
    }
  }, [finances, isLoading, provider, mainToken, executorId]);

  const RenderTransactionCard = useCallback(() => {
    if (isLoading) {
      return Array(5)
        .fill(0)
        .map((_, index) => <DaoTransactionCard key={index} />);
    }

    const txs = transactions.map((data, index) => <DaoTransactionCard info={data} key={index} />);
    if (txs.length === 0) return <NoResultFound type="transaction" />;
    return txs;
  }, [isLoading, transactions]);

  const openTransferModal = useCallback(() => {
    if (!isConnected) {
      toast(Error.ConnectAccount);
      return;
    }
    if (daoName) {
      trackEvent(EventType.DEPOSIT_ASSETS_ClICKED, { dao_name: daoName });
    }

    setIsTransferModalOpen(true);
  }, [setIsTransferModalOpen, toast, isConnected, daoName]);

  const close = () => setIsTransferModalOpen(false);

  return (
    <SkeletonTheme color="#F6F9FC">
      <Grid gap={24}>
        <SideCard layoutIsSmall={layoutIsSmall} isMediumPortrait={isMediumPortrait}>
          <FinanceSideCard
            tokens={tokens}
            mainToken={mainToken}
            onNewTransfer={openTransferModal}
          />
        </SideCard>
        {!layoutIsSmall && (
          <GridItem
            gridRow={layoutIsSmall ? '2/-1' : '1/2'}
            gridColumn={layoutIsSmall ? '1/-1' : '1/5'}
          >
            <HeaderContainer>
              <Title>Finance</Title>
              <CustomActionButton label="New Transfer" onClick={openTransferModal} />
            </HeaderContainer>
          </GridItem>
        )}
        <ListContainer layoutIsSmall={layoutIsSmall} isMediumPortrait={isMediumPortrait}>
          <TransactionListContainer>
            <ListTitle>Transactions</ListTitle>
            {RenderTransactionCard()}
          </TransactionListContainer>
          <DaoTransferModal
            opened={isTransferModalOpen}
            close={close}
            daoName={daoName}
            executorId={executorId}
          />
        </ListContainer>
      </Grid>
    </SkeletonTheme>
  );
};

export default DaoFinancePage;
