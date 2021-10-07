import { createContext, useContext, useCallback, useState, useMemo } from 'react';

import { CustomTransaction } from 'utils/types';

const TransferContext = createContext<TransferContextType | null>(null);

type TransferContextType = {
  state: TransferState;
  gotoState: (value: TransferState) => void;
  executorId: string;
  transactions: CustomTransaction[];
  daoIdentifier: string;
  setTransactions: (value: CustomTransaction[]) => void;
};

export type TransferState = 'initial' | 'selectToken' | 'review' | 'sign' | 'success' | 'fail';

type Props = { children: any; daoName: string; executor: string };

const defaultState: TransferState = 'initial';

const TransferProvider: React.FC<Props> = ({ children, daoName, executor }) => {
  const [executorId] = useState<TransferContextType['executorId']>(executor);
  const [daoIdentifier] = useState<TransferContextType['daoIdentifier']>(daoName);
  const [state, setState] = useState<TransferContextType['state']>(defaultState);
  const [transactions, setTransactions] = useState<TransferContextType['transactions']>([]);

  const gotoState = useCallback(
    (newState: TransferState) => {
      setState(newState);
    },
    [setState],
  );

  const value = useMemo(
    (): TransferContextType => ({
      state,
      gotoState,
      executorId,
      transactions,
      daoIdentifier,
      setTransactions,
    }),
    [executorId, state, transactions, daoIdentifier, gotoState],
  );

  return <TransferContext.Provider value={value}>{children}</TransferContext.Provider>;
};

function useTransferContext(): TransferContextType {
  return useContext(TransferContext) as TransferContextType;
}

export { useTransferContext, TransferProvider };
