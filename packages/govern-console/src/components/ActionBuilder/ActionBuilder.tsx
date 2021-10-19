import React from 'react';
import { ActionBuilderCloseHandler, ActionBuilderState as State } from 'utils/types';
import { TokenMinter } from './Screens/TokenMinter';
import { ActionSelector } from './Screens/ActionSelector';
import { AbiForm } from './Screens/AbiForm';
import { FunctionSelector } from './Screens/FunctionSelector';
import { ActionBuilderModal } from './ActionBuilderModal';
import { ActionBuilderStateProvider, useActionBuilderState } from './ActionBuilderStateProvider';
import { useParams } from 'react-router-dom';
import { useDaoQuery } from 'hooks/query-hooks';
import { Deposit } from 'components/ActionBuilder/Screens/Deposit';
import TransactionKeeper from 'components/TransactionKeeper/TransactionKeeper';

type ActionBuilderProps = {
  initialState?: State;
  visible: boolean;
  onClose: ActionBuilderCloseHandler;
};

const ActionBuilderSwitcher: React.FC<ActionBuilderProps> = ({ visible, onClose }) => {
  const { state, transactions } = useActionBuilderState();

  return (
    <ActionBuilderModal visible={visible} onClose={onClose}>
      {() => {
        switch (state) {
          case 'chooseAction':
            return <ActionSelector></ActionSelector>;
          case 'mintTokens':
            return <TokenMinter onClick={onClose}></TokenMinter>;
          case 'chooseFunctions':
            return <FunctionSelector onClick={onClose}></FunctionSelector>;
          case 'abiForm':
            return <AbiForm></AbiForm>;
          case 'processTransaction':
            return (
              <TransactionKeeper
                transactionList={transactions}
                closeModal={onClose}
              ></TransactionKeeper>
            );
          default:
            return null;
        }
      }}
    </ActionBuilderModal>
  );
};

export const ActionBuilder: React.FC<ActionBuilderProps> = ({ initialState, visible, onClose }) => {
  const { daoName } = useParams<any>();
  const { data: dao, loading, error } = useDaoQuery(daoName);

  if (loading || error) return null;

  return (
    <ActionBuilderStateProvider initialState={initialState} dao={dao}>
      <ActionBuilderSwitcher visible={visible} onClose={onClose} />
    </ActionBuilderStateProvider>
  );
};
