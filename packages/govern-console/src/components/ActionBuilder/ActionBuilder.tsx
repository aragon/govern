import React from 'react';
import { ActionBuilderCloseHandler, ActionBuilderState as State } from 'utils/types';
import { AssetWithdrawal } from './Screens/AssetWithdrawal';
import { TokenMinter } from './Screens/TokenMinter';
import { ActionSelector } from './Screens/ActionSelector';
import { AbiForm } from './Screens/AbiForm';
import { FunctionSelector } from './Screens/FunctionSelector';
import { ActionBuilderModal } from './ActionBuilderModal';
import { ActionBuilderStateProvider, useActionBuilderState } from './ActionBuilderStateProvider';
import { useParams } from 'react-router-dom';
import { useDaoQuery } from 'hooks/query-hooks';
import { Deposit } from 'components/ActionBuilder/Screens/Deposit';

type ActionBuilderProps = {
  initialState?: State;
  visible: boolean;
  onClose: ActionBuilderCloseHandler;
};

const ActionBuilderSwitcher: React.FC<ActionBuilderProps> = ({ visible, onClose }) => {
  const { state } = useActionBuilderState();

  return (
    <ActionBuilderModal visible={visible} onClose={onClose}>
      {() => {
        switch (state) {
          case 'deposit':
            return <Deposit onClick={onClose}></Deposit>;
          case 'chooseAction':
            return <ActionSelector></ActionSelector>;
          case 'mintTokens':
            return <TokenMinter onClick={onClose}></TokenMinter>;
          case 'withdrawAssets':
            return <AssetWithdrawal onClick={onClose}></AssetWithdrawal>;
          case 'chooseFunctions':
            return <FunctionSelector onClick={onClose}></FunctionSelector>;
          case 'abiForm':
            return <AbiForm></AbiForm>;
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
