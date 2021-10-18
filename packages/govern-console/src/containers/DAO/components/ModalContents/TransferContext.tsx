import { createContext, useContext, useCallback, useState, useMemo } from 'react';

import { CustomTransaction, ActionItem } from 'utils/types';

const TransferContext = createContext<TransferContextType | null>(null);

type TransferContextType = {
  state: TransferState;
  gotoState: (value: TransferState) => void;
  executorId: string;
  transactions: CustomTransaction[];
  actions: ActionItem[];
  daoIdentifier: string;
  setTransactions: (value: CustomTransaction[]) => void;
  setActions: (value: ActionItem[]) => void;
};

export type TransferState = 'initial' | 'selectToken' | 'review' | 'sign' | 'success' | 'fail';

type Props = { children: any; daoName: string; executor: string };

const defaultState: TransferState = 'initial';

const TransferProvider: React.FC<Props> = ({ children, daoName, executor }) => {
  const [executorId] = useState<TransferContextType['executorId']>(executor);
  const [daoIdentifier] = useState<TransferContextType['daoIdentifier']>(daoName);
  const [state, setState] = useState<TransferContextType['state']>(defaultState);
  const [transactions, setTransactions] = useState<TransferContextType['transactions']>([]);
  const [actions, setActions] = useState<TransferContextType['actions']>([]);

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
      actions,
      daoIdentifier,
      setTransactions,
      setActions,
    }),
    [executorId, state, transactions, actions, daoIdentifier, gotoState],
  );

  return <TransferContext.Provider value={value}>{children}</TransferContext.Provider>;
};

function useTransferContext(): TransferContextType {
  return useContext(TransferContext) as TransferContextType;
}

export { useTransferContext, TransferProvider };
