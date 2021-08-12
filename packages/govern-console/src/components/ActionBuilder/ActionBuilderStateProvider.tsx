import React, { ReactNode, createContext, useMemo, useState, useContext, useCallback } from 'react';
import { ActionBuilderState, CustomTransaction } from 'utils/types';

type ActionBuilderStateProviderProps = {
  children: ReactNode;
  dao: any;
  initialState?: ActionBuilderState;
};

type ActionBuilderStateContext = {
  state: ActionBuilderState;
  contractAddress: string | null;
  abi: string | null;
  dao: any;
  transactions: CustomTransaction[];
  gotoState: (newState: ActionBuilderState) => void;
  gotoFunctionSelector: (contractAddress: string, abi: string) => void;
  gotoProcessTransaction: (transactions: CustomTransaction[]) => void;
};

const defaultState: ActionBuilderState = 'chooseAction';
const UseActionBuilderStateContext = createContext<ActionBuilderStateContext | null>(null);

const ActionBuilderStateProvider: React.FC<ActionBuilderStateProviderProps> = ({
  initialState,
  dao,
  children,
}) => {
  const [state, setState] = useState<ActionBuilderStateContext['state']>(
    initialState || defaultState,
  );

  const [contractAddress, setContractAddress] = useState<
    ActionBuilderStateContext['contractAddress']
  >(null);

  const [abi, setAbi] = useState<ActionBuilderStateContext['abi']>(null);
  const [transactions, setTransactions] = useState<ActionBuilderStateContext['transactions']>([]);

  const gotoState = useCallback(
    (newState: ActionBuilderState) => {
      setState(newState);
    },
    [setState],
  );

  const gotoFunctionSelector = useCallback(
    (contractAddress: string, abi: string) => {
      setContractAddress(contractAddress);
      setAbi(abi);
      setState('chooseFunctions');
    },
    [setState, setContractAddress],
  );

  const gotoProcessTransaction = useCallback(
    (transactions: CustomTransaction[]) => {
      setTransactions(transactions);
      setState('processTransaction');
    },
    [setTransactions, setState],
  );

  const contextValue = useMemo(
    (): ActionBuilderStateContext => ({
      state,
      contractAddress,
      abi,
      dao,
      transactions,
      gotoState,
      gotoFunctionSelector,
      gotoProcessTransaction,
    }),
    [
      state,
      contractAddress,
      dao,
      abi,
      transactions,
      gotoState,
      gotoFunctionSelector,
      gotoProcessTransaction,
    ],
  );

  return (
    <UseActionBuilderStateContext.Provider value={contextValue}>
      {children}
    </UseActionBuilderStateContext.Provider>
  );
};

function useActionBuilderState(): ActionBuilderStateContext {
  return useContext(UseActionBuilderStateContext) as ActionBuilderStateContext;
}

export { ActionBuilderStateProvider, useActionBuilderState };
