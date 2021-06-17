import React, { memo, useState, useEffect, useReducer } from 'react';
import { IconAdd, Box, Button, StyledText, Link, TextInput } from '@aragon/ui';
import { PageName } from 'utils/HelpText';
import PageContent from 'components/PageContent/PageContent';
import ActionList, { ActionOperation } from 'components/ActionList/ActionList';
import { NewActionModal } from 'components/Modal/NewActionModal';
import { AddActionsModal } from 'components/Modal/AddActionsModal';
import { useParams, useHistory } from 'react-router-dom';
import { ContractReceipt, utils } from 'ethers';
import { useWallet } from 'AugmentedWallet';
import { buildConfig } from 'utils/ERC3000';
import { CustomTransaction, abiItem, actionType, ActionToSchedule } from 'utils/types';
import { useSnackbar } from 'notistack';
import { ActionTypes, ModalsContext } from 'containers/HomePage/ModalsContext';
import { useForm, FormProvider } from 'react-hook-form';
import { Proposal, ReceiptType, ActionType } from '@aragon/govern';
import { proposalDetailsUrl } from 'utils/urls';
import { addToIpfs } from 'utils/ipfs';
import { useFacadeProposal } from 'hooks/proposal-hooks';
import { IPFSInput } from 'components/Field/IPFSInput';
import { settingsUrl } from 'utils/urls';
import { useDaoQuery } from 'hooks/query-hooks';
import styled from 'styled-components';

const Field = styled('div')({
  margin: '20px 0',
});

interface FormInputs {
  proof: string;
  proofFile: any;
  title: string;
}

const selectedActionsReducer = (state: any, op: ActionOperation) => {
  switch (op.type) {
    case 'add':
      return [...state, ...op.actions] as any;
    case 'remove':
      return state.filter((_: any, index: number) => index !== op.index);
    case 'move-up':
    case 'move-down':
      const newActions = [...state];
      if (
        (op.type === 'move-up' && op.index > 0) ||
        (op.type === 'move-down' && op.index < state.length - 1)
      ) {
        const swapIndex = op.type === 'move-up' ? op.index - 1 : op.index + 1;
        [newActions[swapIndex], newActions[op.index]] = [
          newActions[op.index],
          newActions[swapIndex],
        ];
      }
      return newActions;
    default:
      return [...state];
  }
};

const NewExecution: React.FC = () => {
  const history = useHistory();

  const { daoName } = useParams<any>();
  //TODO daoname empty handling

  const { data: dao } = useDaoQuery(daoName);

  const { enqueueSnackbar } = useSnackbar();
  const { dispatch } = React.useContext(ModalsContext);

  // form
  const methods = useForm<FormInputs>();
  const {
    getValues,
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const [selectedActions, dispatchActionChanges] = useReducer(selectedActionsReducer, []);
  const [isInputModalOpen, setInputModalOpen] = useState(false);
  const [isActionModalOpen, setActionModalOpen] = useState(false);
  const [daoDetails, updateDaoDetails] = useState<any>();
  const [abiFunctions, setAbiFunctions] = useState([]);
  const [actionsToSchedule, setActionsToSchedule] = useState([]);

  useEffect(() => {
    if (dao) {
      updateDaoDetails(dao);
    }
  }, [dao]);

  const context: any = useWallet();
  const { account, isConnected } = context;

  const proposalInstance = useFacadeProposal(
    daoDetails?.queue.address,
    daoDetails?.queue.config.resolver,
  );

  const transactionsQueue = React.useRef<CustomTransaction[]>([]);

  const handleInputModalOpen = () => {
    setInputModalOpen(true);
  };

  const handleInputModalClose = () => {
    setInputModalOpen(false);
  };

  const handleActionModalOpen = () => {
    setActionModalOpen(true);
  };

  const handleActionModalClose = () => {
    setActionModalOpen(false);
  };

  const onAddNewActions = (actions: any) => {
    handleActionModalClose();
    const newActions = [...selectedActions, ...actions] as any;
    dispatchActionChanges({ type: 'add', actions: newActions });
    const initialActions: ActionToSchedule[] = newActions.map((actionItem: actionType) => {
      const { contractAddress, name, item, abi } = actionItem;
      const { inputs } = item;
      const numberOfInputs = inputs.length;
      const params = {};
      const data = {
        contractAddress,
        name,
        params,
        abi,
        numberOfInputs,
      };
      return data as ActionToSchedule;
    });
    setActionsToSchedule(initialActions as []);
  };

  const onAddInputToAction = (
    value: string,
    contractAddress: string,
    abi: any[],
    functionIndex: number,
    inputIndex: number,
  ) => {
    const actions: any[] = actionsToSchedule;
    const { params } = actions[functionIndex];
    params[inputIndex] = value;
    delete actions[functionIndex].params;
    actions[functionIndex] = {
      params,
      ...actions[functionIndex],
    };
    setActionsToSchedule(actions as []);
    // actionsToSchedule.current = actions as [];
  };
  // const onScheduleProposal = () => {};

  const onGenerateActionsFromAbi = async (contractAddress: string, abi: any[]) => {
    const functions = [] as any;
    await abi.forEach((item: abiItem) => {
      const { name, type, stateMutability } = item;
      if (type === 'function' && stateMutability !== 'view' && stateMutability !== 'pure') {
        const data = {
          abi,
          name,
          type,
          item,
          contractAddress,
        };
        functions.push(data);
      }
    });

    setAbiFunctions(functions);
    // abiFunctions.current = functions;
    handleInputModalClose();
    handleActionModalOpen();
  };

  const validate = () => {
    if (actionsToSchedule.length === 0) {
      enqueueSnackbar('At least one action is needed to schedule an execution.', {
        variant: 'error',
      });
      return false;
    }
    return true;
  };

  const onSchedule = () => {
    if (!validate()) return;
    const actions: any[] = actionsToSchedule.map((item: any) => {
      const { abi, contractAddress, name, params } = item;
      const abiInterface = new utils.Interface(abi);
      const functionParameters = [];
      for (const key in params) {
        functionParameters.push(params[key]);
      }
      console.log('functionParams', functionParameters);
      const calldata = abiInterface.encodeFunctionData(name, functionParameters);
      const data = {
        to: contractAddress,
        value: 0,
        data: calldata,
      };
      return data;
    });
    console.log(actions, ' actions here');
    scheduleProposal(actions);
  };

  const scheduleProposal = async (actions: ActionType[]) => {
    // TODO: add modal

    const proof = getValues('proofFile') ? getValues('proofFile')[0] : getValues('proof');
    const proofCid = await addToIpfs(proof, {
      title: getValues('title'),
    });

    let containerHash: string | undefined;

    // build the container to schedule.
    const payload = {
      submitter: account.address,
      executor: daoDetails.executor.address,
      actions: actions,
      proof: proofCid,
    };

    if (proposalInstance) {
      try {
        transactionsQueue.current = await proposalInstance.schedule(
          payload,
          buildConfig(daoDetails.queue.config),
        );
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }

    dispatch({
      type: ActionTypes.OPEN_TRANSACTIONS_MODAL,
      payload: {
        transactionList: transactionsQueue.current,
        onTransactionFailure: () => {
          /* do nothing */
        },
        onTransactionSuccess: (_, receipt: ContractReceipt) => {
          containerHash = Proposal.getContainerHashFromReceipt(receipt, ReceiptType.Scheduled);
        },
        onCompleteAllTransactions: () => {
          if (containerHash) {
            history.push(proposalDetailsUrl(daoName, containerHash));
          }
        },
      },
    });
  };

  return (
    <PageContent pageName={PageName.NEW_EXECUTION}>
      <Box>
        <StyledText name={'title2'}>New execution</StyledText>
        <StyledText name={'body3'}>
          This execution will use the current{' '}
          <Link onClick={() => history.push(settingsUrl(daoName))}>DAO Settings</Link>
        </StyledText>
        <FormProvider {...methods}>
          <Field>
            <StyledText name={'title4'}>Title</StyledText>{' '}
            <TextInput
              {...register('title', { required: 'This is required.' })}
              wide
              title=""
              placeholder="Type execution title"
              status={errors['title'] ? 'error' : 'normal'}
              error={errors['title']?.message}
            />
          </Field>
          <Field>
            <StyledText name={'title4'}>Justification</StyledText>{' '}
            <StyledText name={'body3'}>
              Insert the reason for scheduling this execution so DAO members can understand it.
            </StyledText>
            <IPFSInput
              label=""
              placeholder="Please insert the reason why you want to execute this"
              textInputName="proof"
              fileInputName="proofFile"
            />
          </Field>
          <Field>
            <StyledText name={'title4'}>Actions</StyledText>
            <StyledText name={'body3'}>
              Add as many actions (smart contract interactions) you want for this execution.
            </StyledText>
            <ActionList
              selectedActions={selectedActions}
              onActionChange={dispatchActionChanges}
              onAddInputToAction={onAddInputToAction}
              actionsToSchedule={actionsToSchedule}
            />
            <br />
            <Button
              mode={'secondary'}
              icon={<IconAdd />}
              label={'Add new action'}
              onClick={handleInputModalOpen}
            ></Button>
          </Field>
          <Button
            wide
            size={'large'}
            mode={'primary'}
            disabled={!isConnected}
            onClick={handleSubmit(() => onSchedule())}
            label={'Schedule'}
          ></Button>
          {isInputModalOpen && (
            <NewActionModal
              onCloseModal={handleInputModalClose}
              onGenerate={onGenerateActionsFromAbi}
              open={isInputModalOpen}
            ></NewActionModal>
          )}
          {isActionModalOpen && (
            <AddActionsModal
              onCloseModal={handleActionModalClose}
              open={isActionModalOpen}
              onAddActions={onAddNewActions}
              actions={abiFunctions as any}
            ></AddActionsModal>
          )}
        </FormProvider>
      </Box>
    </PageContent>
  );
};

export default memo(NewExecution);
