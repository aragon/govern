/* eslint-disable */
import React, { createContext, Dispatch, useReducer } from 'react';
import TransctionsModal from 'components/Modal/TransactionsModal';
import { CustomTransaction } from 'utils/types';
export enum ActionTypes {
  OPEN_TRANSACTIONS_MODAL = 'OPEN_TRANSACTIONS_MODAL',
  CLOSE = 'CLOSE',
}
type TransactionsModalAction = {
  type: ActionTypes.OPEN_TRANSACTIONS_MODAL;
  payload: {
    transactionList: CustomTransaction[];
    onTransactionFailure: (
      errorMessage: string,
      transaction: CustomTransaction,
    ) => void;
    onTransactionSuccess: (
      updatedTransaction: CustomTransaction,
      transactionReceipt: any,
    ) => void;
    onCompleteAllTransactions: (transactions: CustomTransaction[]) => void;
  };
};

type CloseAction = {
  type: ActionTypes.CLOSE;
  payload: {
    modal: keyof ModalContextState;
  };
};

type ModalsContextAction = TransactionsModalAction | CloseAction;

interface ModalContextState {
  transactionsModal: {
    open: boolean;
    params: {
      transactionList: CustomTransaction[];
      onTransactionFailure: (
        errorMessage: string,
        transaction: CustomTransaction,
      ) => void;
      onTransactionSuccess: (
        updatedTransaction: CustomTransaction,
        transactionReceipt: any,
      ) => void;
      onCompleteAllTransactions: (transactions: CustomTransaction[]) => void;
    };
  };
}

interface Context {
  state: ModalContextState;
  dispatch: Dispatch<ModalsContextAction>;
}

const INITIAL_STATE: ModalContextState = {
  transactionsModal: {
    open: false,
    params: {
      transactionList: [],
      onTransactionFailure: (
        errorMessage: string,
        transaction: CustomTransaction,
      ) => {
        // do nothing
      },
      onTransactionSuccess: (
        updatedTransaction: CustomTransaction,
        transactionReceipt: any,
      ) => {
        // do nothing
      },
      onCompleteAllTransactions: (transactions: CustomTransaction[]) => {
        // do nothing
      },
    },
  },
};

export const ModalsContext = createContext<Context>({
  state: INITIAL_STATE,
  dispatch: () => null,
});

const reducer = (
  state: ModalContextState,
  action: ModalsContextAction,
): ModalContextState => {
  switch (action.type) {
    case ActionTypes.OPEN_TRANSACTIONS_MODAL:
      return {
        ...state,
        transactionsModal: { open: true, params: { ...action.payload } },
      };
    case ActionTypes.CLOSE:
      return INITIAL_STATE;
    default:
      throw new Error(`Unrecognized action in Modals Provider`);
  }
};

export const ModalsProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  return (
    <ModalsContext.Provider value={{ state, dispatch }}>
      {children}
      <TransctionsModal />
    </ModalsContext.Provider>
  );
};

export const closeTransactionsModalAction: CloseAction = {
  type: ActionTypes.CLOSE,
  payload: {
    modal: 'transactionsModal',
  },
}
