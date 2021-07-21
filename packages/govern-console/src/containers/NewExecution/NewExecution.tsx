import React, { memo, useState, useCallback } from 'react';
import {
  IconAdd,
  Grid,
  GridItem,
  Button,
  StyledText,
  Link,
  TextInput,
  Box,
  useToast,
} from '@aragon/ui';
import { PageName } from 'utils/HelpText';
import PageContent from 'components/PageContent/PageContent';
import ActionList from 'containers/NewExecution/ActionList';
import { ActionBuilder } from 'components/ActionBuilder/ActionBuilder';
import { useParams, useHistory } from 'react-router-dom';
import { ContractReceipt } from 'ethers';
import { useWallet } from 'AugmentedWallet';
import { buildConfig } from 'utils/ERC3000';
import { CustomTransaction, ActionItem } from 'utils/types';
import { ActionTypes, ModalsContext } from 'containers/HomePage/ModalsContext';
import { useForm, FormProvider, Controller, useFieldArray } from 'react-hook-form';
import { Proposal, ReceiptType, ActionType } from '@aragon/govern';
import { proposalDetailsUrl } from 'utils/urls';
import { addToIpfs } from 'utils/ipfs';
import { useFacadeProposal } from 'hooks/proposal-hooks';
import { IPFSInput } from 'components/Field/IPFSInput';
import { settingsUrl } from 'utils/urls';
import { useDaoQuery } from 'hooks/query-hooks';
import { Error } from 'utils/Error';
import AbiHandler from 'utils/AbiHandler';

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

  const toast = useToast();
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

  const openActionModal = useCallback(() => {
    if (isConnected) {
      setShowActionModal(true);
    } else {
      toast(Error.ConnectAccount);
    }
  }, [isConnected, setShowActionModal, toast]);

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
      toast('At least one action is needed to schedule an execution.');
      return false;
    }
    return true;
  };

  const onSchedule = () => {
    if (!validate()) return;

    const actions = getValues('actions');
    try {
      const encodedActions = AbiHandler.encodeActions(actions);
      scheduleProposal(encodedActions);
    } catch (err) {
      console.log('Failed to encode action data', err);
      toast('Error encoding action data, please double check your action input.');
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
        console.log('Failed scheduling', error);
        toast(error.message);
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
      <Box>
        <Grid>
          <GridItem>
            <StyledText name={'title1'}>New execution</StyledText>
            <StyledText name={'title4'}>
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
                    subtitle="Add a title to identify this transaction."
                    value={value}
                    placeholder="Sending funds to SuperDAO as per Voice vote 0x486...9b3b."
                    onChange={onChange}
                    status={error ? 'error' : 'normal'}
                    error={error ? error.message : null}
                  />
                )}
              />
            </GridItem>
            <GridItem>
              <IPFSInput
                title="Justification"
                subtitle="Tell DAO members why you are scheduling this transaction."
                label=""
                placeholder="Please insert the reason why you want to execute this"
                textInputName="proof"
                fileInputName="proofFile"
              />
            </GridItem>
            <GridItem>
              <StyledText name={'title3'}>Transactions</StyledText>
              <StyledText name={'title4'}>
                Batch as many transactions as you like into a single execution.
              </StyledText>
              <ActionList actions={fields} swap={swap} remove={remove} />
              <br />
              <Button
                mode="secondary"
                icon={<IconAdd />}
                label="Add new transaction"
                onClick={openActionModal}
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
      </Box>
    </PageContent>
  );
};

export default memo(NewExecution);
