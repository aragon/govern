import React, { memo, useState, useEffect } from 'react';
import {
  useLayout,
  Grid,
  GridItem,
  Accordion,
  Field,
  TextInput,
  Checkbox,
  IconAdd,
  Box,
  Button,
  StyledText,
  SPACING,
  Link,
} from '@aragon/ui';
import backButtonIcon from 'images/back-btn.svg';
import { HelpButton } from 'components/HelpButton/HelpButton';
import { NewActionModal } from 'components/Modal/NewActionModal';
import { AddActionsModal } from 'components/Modal/AddActionsModal';
import { InputField } from 'components/InputFields/InputField';
import { useParams, useHistory } from 'react-router-dom';
import { ContractReceipt, utils } from 'ethers';
import { useWallet } from 'AugmentedWallet';
import { buildConfig } from 'utils/ERC3000';
import { CustomTransaction, abiItem, actionType, ActionToSchedule } from 'utils/types';
import { useSnackbar } from 'notistack';
import { ActionTypes, ModalsContext } from 'containers/HomePage/ModalsContext';
import { useForm, FormProvider, Controller } from 'react-hook-form';
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
}

export interface AddedActionsProps {
  /**
   * Added actions
   */
  selectedActions?: any;
  onAddInputToAction: any;
  actionsToSchedule: any;
}

const AddedActions: React.FC<AddedActionsProps> = ({ selectedActions, onAddInputToAction }) => {
  const actionDivStyle = {
    width: '862px',
    border: '2px solid #E2ECF5',
    borderRadius: '10px',
    paddingLeft: '24px',
    paddingRight: '24px',
    paddingBottom: '22px',
    paddingTop: '22px',
    marginTop: '18px',
  };

  const actionNameDivStyle = {
    paddingBottom: '21px',
    borderBottom: '2px solid #E2ECF5',
  };

  return selectedActions.map((action: any, index: number) => {
    return (
      <div style={{ marginTop: '24px' }} key={action.name}>
        <div>
          <StyledText name={'title2'}>Contract Address</StyledText>
          <StyledText name={'body2'}>{action.contractAddress}</StyledText>
        </div>
        <div style={actionDivStyle}>
          <div style={actionNameDivStyle}>
            <StyledText name={'body2'}>{action.name}</StyledText>
          </div>
          {action.item.inputs.map((input: any, num: number) => {
            const element = (
              <div key={input.name}>
                <div style={{ marginTop: '20px' }}>
                  <StyledText name={'title2'}>
                    {input.name}({input.type})
                  </StyledText>
                </div>
                <div style={{ marginTop: '20px' }}>
                  <InputField
                    label=""
                    onInputChange={(val) => {
                      onAddInputToAction(
                        val,
                        action.contractAddress,
                        action.abi,
                        index,
                        num,
                        action.name,
                      );
                    }}
                    // value={actionsToSchedule[index]?.params[num] || ''}
                    height="46px"
                    width="814px"
                    placeholder={input.name}
                  ></InputField>
                </div>
              </div>
            );
            return element;
          })}
        </div>
      </div>
    );
  });
};

const NewExecution: React.FC = () => {
  const history = useHistory();

  const { layoutName } = useLayout();
  const spacing = SPACING[layoutName];

  const { daoName } = useParams<any>();
  //TODO daoname empty handling

  const { data: dao } = useDaoQuery(daoName);

  const { enqueueSnackbar } = useSnackbar();
  const { dispatch } = React.useContext(ModalsContext);

  // form
  const methods = useForm<FormInputs>();
  const { getValues, handleSubmit, control } = methods;

  const [selectedActions, updateSelectedOptions] = useState([]);
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
    updateSelectedOptions(newActions);
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
      enqueueSnackbar('At least one action is needed to schedule a proposal.', {
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
    <Grid layout={true}>
      <GridItem gridColumn={'2/13'} gridRow={'1/4'}>
        <Box>
          <StyledText name={'title2'}>New Execution</StyledText>
          <StyledText name={'body2'}>
            This execution will use the current{' '}
            <Link onClick={() => history.push(settingsUrl(daoName))}>DAO Settings</Link>
          </StyledText>

          <FormProvider {...methods}>
            <StyledText name={'title2'}>Title</StyledText>{' '}
            <Controller
              name="title"
              control={control}
              defaultValue={''}
              rules={{ required: 'This is required.' }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <InputField
                  label=""
                  onInputChange={onChange}
                  value={value}
                  height={'100px'}
                  placeholder="Type execution title"
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
            <StyledText name={'title2'}>Justification</StyledText>{' '}
            <IPFSInput
              label="Enter the justification for changes"
              placeholder="Justification Reason..."
              textInputName="proof"
              fileInputName="proofFile"
            />
            <br></br>
            <StyledText name={'title2'}>Actions</StyledText>
            {selectedActions.length === 0 ? (
              <StyledText name={'body2'}>No actions defined Yet</StyledText>
            ) : (
              <div>
                <AddedActions
                  selectedActions={selectedActions}
                  onAddInputToAction={onAddInputToAction}
                  actionsToSchedule={actionsToSchedule}
                />
              </div>
            )}
            <br />
            <Button
              mode={'secondary'}
              icon={<IconAdd />}
              label={'Add new action'}
              onClick={handleInputModalOpen}
            ></Button>
            <br />
            <Button
              wide
              size={'large'}
              mode={'primary'}
              disabled={!isConnected}
              onClick={handleSubmit(() => onSchedule())}
              style={{ marginTop: spacing }}
            >
              Schedule
            </Button>
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
      </GridItem>
      <GridItem
        gridRow={layoutName === 'large' ? '1' : undefined}
        gridColumn={layoutName === 'large' ? '13/17' : '1 / -1'}
      >
        <Accordion
          items={[[<div key={1}>Row content</div>, <div key={2}>Expandable content</div>]]}
        ></Accordion>
        <Accordion items={['accordionItems']}></Accordion>
        <Accordion items={['accordionItems']}></Accordion>
      </GridItem>
      <GridItem
        gridRow={layoutName === 'large' ? '2' : undefined}
        gridColumn={layoutName === 'large' ? '13/17' : '1 / -1'}
      >
        {/* TODO: To be moved to its own component*/}
        <Box style={{ background: '#8991FF', opacity: 0.5 }}>
          <h5 style={{ color: '#20232C' }}>Need Help?</h5>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default memo(NewExecution);
