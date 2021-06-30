import React, { ReactNode, createContext, useMemo, useState, useContext, useCallback } from 'react';
import { ActionBuilderState, ContractId } from 'utils/types';

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
  gotoState: (newState: ActionBuilderState) => void;
  updateAbi: (newAbi: string) => void;
  gotoAbiForm: (contractId: ContractId) => void;
  gotoFunctionSelector: (contractAddress: string, abi: string) => void;
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

  const updateAbi = useCallback(
    (abi: string) => {
      setAbi(abi);
    },
    [setAbi],
  );

  const gotoState = useCallback(
    (newState: ActionBuilderState) => {
      setState(newState);
    },
    [setState],
  );

  const toContractAddress = useCallback(
    (id: ContractId) => {
      const addressMap: Record<ContractId, string> = {
        executor: dao.executor.address,
        minter: dao.token,
        queue: dao.queue.address,
        external: '',
      };
      return addressMap[id];
    },
    [dao],
  );

  const gotoAbiForm = useCallback(
    (id: ContractId) => {
      const address = toContractAddress(id);
      setContractAddress(address);
      setState('abiForm');
    },
    [setContractAddress, setState, toContractAddress],
  );

  const gotoFunctionSelector = useCallback(
    (contractAddress: string, abi: string) => {
      setContractAddress(contractAddress);
      setAbi(abi);
      setState('chooseFunctions');
    },
    [setState, setContractAddress],
  );

  const contextValue = useMemo(
    (): ActionBuilderStateContext => ({
      state,
      contractAddress,
      abi,
      dao,
      gotoState,
      updateAbi,
      gotoAbiForm,
      gotoFunctionSelector,
    }),
    [state, contractAddress, dao, abi, gotoState, updateAbi, gotoAbiForm, gotoFunctionSelector],
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
