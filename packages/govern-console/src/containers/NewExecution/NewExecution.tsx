import React, { memo, useState, useCallback } from 'react';
import { IconAdd, Grid, GridItem, Button, StyledText, Link, TextInput } from '@aragon/ui';
import { PageName } from 'utils/HelpText';
import PageContent from 'components/PageContent/PageContent';
import ActionList from 'containers/NewExecution/ActionList';
import { ActionBuilder } from 'components/ActionBuilder/ActionBuilder';
import { useParams, useHistory } from 'react-router-dom';
import { ContractReceipt, utils } from 'ethers';
import { useWallet } from 'AugmentedWallet';
import { buildConfig } from 'utils/ERC3000';
import { CustomTransaction, ActionItem } from 'utils/types';
import { useSnackbar } from 'notistack';
import { ActionTypes, ModalsContext } from 'containers/HomePage/ModalsContext';
import { useForm, FormProvider, Controller, useFieldArray } from 'react-hook-form';
import { Proposal, ReceiptType, ActionType } from '@aragon/govern';
import { proposalDetailsUrl } from 'utils/urls';
import { addToIpfs } from 'utils/ipfs';
import { useFacadeProposal } from 'hooks/proposal-hooks';
import { IPFSInput } from 'components/Field/IPFSInput';
import { settingsUrl } from 'utils/urls';
import { useDaoQuery } from 'hooks/query-hooks';

interface FormInputs {
  proof: string;
  proofFile: any;
  title: string;
  actions: ActionItem[];
}

const NewExecution: React.FC = () => {
  const history = useHistory();

  //TODO daoname empty handling
  const { daoName } = useParams<any>();
  const { data: daoDetails } = useDaoQuery(daoName);

  const { enqueueSnackbar } = useSnackbar();
  const { dispatch } = React.useContext(ModalsContext);

  // form
  const methods = useForm<FormInputs>();
  const { control, getValues, handleSubmit } = methods;
  const { fields, append, swap, remove } = useFieldArray({
    control,
    name: 'actions',
  });

  const [showActionModal, setShowActionModal] = useState(false);

  const context: any = useWallet();
  const { account, isConnected } = context;

  const proposalInstance = useFacadeProposal(
    daoDetails?.queue.address,
    daoDetails?.queue.config.resolver,
  );

  const transactionsQueue = React.useRef<CustomTransaction[]>([]);

  const onCloseActionModal = useCallback(
    (actions: any) => {
      if (actions) {
        append(actions);
      }
      setShowActionModal(false);
    },
    [append],
  );

  const validate = () => {
    const actions = getValues('actions');
    if (!actions || actions.length === 0) {
      enqueueSnackbar('At least one action is needed to schedule an execution.', {
        variant: 'error',
      });
      return false;
    }
    return true;
  };

  const onSchedule = () => {
    if (!validate()) return;

    const errors: string[] = [];
    const values = getValues('actions');
    console.log('schedule with ', values);

    const actions = values.map((item) => {
      const { sighash, signature, contractAddress, inputs } = item;
      const abiInterface = new utils.Interface([`${signature}`]);
      const functionParameters = inputs.map((input) => input.value);

      let calldata = '';
      try {
        calldata = abiInterface.encodeFunctionData(sighash, functionParameters);
      } catch (err) {
        errors.push(err.message);
      }
      const data: ActionType = {
        to: contractAddress,
        value: 0,
        data: calldata,
      };
      return data;
    });

    if (errors.length > 0) {
      enqueueSnackbar('Error encoding action data, please double check your action input.', {
        variant: 'error',
      });
    } else {
      scheduleProposal(actions);
    }
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
        return;
      }
    }

    dispatch({
      type: ActionTypes.OPEN_TRANSACTIONS_MODAL,
      payload: {
        transactionList: transactionsQueue.current,
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
      <Grid>
        <GridItem>
          <StyledText name={'title1'}>New execution</StyledText>
          <StyledText name={'body3'}>
            This execution will use the current{' '}
            <Link onClick={() => history.push(settingsUrl(daoName))}>DAO Settings</Link>
          </StyledText>
        </GridItem>
        <FormProvider {...methods}>
          <GridItem>
            <Controller
              name="title"
              control={control}
              rules={{
                required: 'This is required.',
              }}
              defaultValue=""
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextInput
                  wide
                  title="Title"
                  value={value}
                  placeholder="Type execution title"
                  onChange={onChange}
                  status={error ? 'error' : 'normal'}
                  error={error ? error.message : null}
                />
              )}
            />
          </GridItem>
          <GridItem>
            <StyledText name={'title2'}>Justification</StyledText>{' '}
            <StyledText name={'body3'}>
              Insert the reason for scheduling this execution so DAO members can understand it.
            </StyledText>
            <IPFSInput
              label=""
              placeholder="Please insert the reason why you want to execute this"
              textInputName="proof"
              fileInputName="proofFile"
            />
          </GridItem>
          <GridItem>
            <StyledText name={'title2'}>Actions</StyledText>
            <StyledText name={'body3'}>
              Add as many actions (smart contract interactions) you want for this execution.
            </StyledText>
            <ActionList actions={fields} swap={swap} remove={remove} />
            <br />
            <Button
              mode="secondary"
              icon={<IconAdd />}
              label="Add new action"
              onClick={() => setShowActionModal(true)}
            ></Button>
          </GridItem>
          <Button
            wide
            size="large"
            mode="primary"
            disabled={!isConnected}
            onClick={handleSubmit(onSchedule)}
            label="Schedule"
          ></Button>
          {showActionModal && (
            <ActionBuilder visible={showActionModal} onClose={onCloseActionModal}></ActionBuilder>
          )}
        </FormProvider>
      </Grid>
    </PageContent>
  );
};

export default memo(NewExecution);
