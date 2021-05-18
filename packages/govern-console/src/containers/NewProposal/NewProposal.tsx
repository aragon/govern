import React, { useState, useEffect, memo } from 'react';
import { ANButton } from 'components/Button/ANButton';
import { styled } from '@material-ui/core/styles';
import backButtonIcon from 'images/back-btn.svg';
import Typography from '@material-ui/core/Typography';
import { HelpButton } from 'components/HelpButton/HelpButton';
import Paper from '@material-ui/core/Paper';
import { NewActionModal } from 'components/Modal/NewActionModal';
import { AddActionsModal } from 'components/Modal/AddActionsModal';
import { InputField } from 'components/InputFields/InputField';
import { useParams, useHistory } from 'react-router-dom';
import { ContractReceipt, utils } from 'ethers';
import { useQuery } from '@apollo/client';
import { GET_DAO_BY_NAME } from '../DAO/queries';
import { buildContainer } from 'utils/ERC3000';
import { useWallet } from 'AugmentedWallet';
import { CustomTransaction, abiItem, actionType, ActionToSchedule } from 'utils/types';
import { useSnackbar } from 'notistack';
import { ActionTypes, ModalsContext } from 'containers/HomePage/ModalsContext';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { Proposal, ProposalOptions, ReceiptType, ActionType } from '@aragon/govern';
import { proposalDetailsUrl } from 'utils/urls';
import { addToIpfs } from 'utils/ipfs';
import { useFacadeProposal } from 'hooks/proposals';
import { toUTF8Bytes } from 'utils/lib';
import { IPFSInput } from 'components/Field/IPFSInput';
import { settingsUrl } from 'utils/urls';

export interface NewProposalProps {
  /**
   * callback for click on schedule
   */
  onSchedule?: any;

  /**
   * onClickBackButton callback
   */
  onClickBack: any;
}

export interface AddedActionsProps {
  /**
   * Added actions
   */
  selectedActions?: any;
  onAddInputToAction: any;
  actionsToSchedule: any;
}

const SubTitle = styled(Typography)({
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: 18,
  lineHeight: '25px',
  color: '#7483AB',
});

const TextBlack = styled(Typography)({
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: 18,
  lineHeight: '25px',
  color: '0A0B0B',
});

const ContractAddressText = styled(Typography)({
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: 18,
  lineHeight: '25px',
  color: '0A0B0B',
});
const WrapperDiv = styled(Paper)(({ theme }) => ({
  width: '100%',
  background: theme.custom.white,
  height: 'auto',
  padding: '50px 273px 76px 273px',
  // display: 'block',
  boxSizing: 'border-box',
  boxShadow: 'none',
  flexDirection: 'column',
  display: 'flex',
}));
const BackButton = styled('div')({
  height: 25,
  width: 62,
  cursor: 'pointer',
  position: 'relative',
  left: -6,
});

// TODO: GIORGI repeating styles
const Title = styled(Typography)({
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: 28,
  lineHeight: '38px',
  color: '#20232C',
  marginTop: 17,
  height: 50,
  display: 'block',
});

const SettingsLink = styled(Typography)({
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  paddingBottom: 10,
  color: '0A0B0B',
  '& a': {
    color: '#00C2FF',
  },
});

export interface NewProposalProps {
  /**
   * callback for click on schedule
   */
  onSchedule?: any;

  /**
   * onClickBackButton callback
   */
  onClickBack: any;
}

export interface AddedActionsProps {
  /**
   * Added actions
   */
  selectedActions?: any;
  onAddInputToAction: any;
}

interface FormInputs {
  proof: string;
  proofFile: any;
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
          <SubTitle>Contract Address</SubTitle>
          <ContractAddressText>{action.contractAddress}</ContractAddressText>
        </div>
        <div style={actionDivStyle}>
          <div style={actionNameDivStyle}>
            <TextBlack>{action.name}</TextBlack>
          </div>
          {action.item.inputs.map((input: any, num: number) => {
            const element = (
              <div key={input.name}>
                <div style={{ marginTop: '20px' }}>
                  <SubTitle>
                    {input.name}({input.type})
                  </SubTitle>
                </div>
                <div style={{ marginTop: '20px' }}>
                  <InputField
                    label=""
                    onInputChange={(val) => {
                      // console.log(
                      //   val,
                      //   action.contractAddress,
                      //   action.abi,
                      //   index,
                      //   num,
                      //   action.name,
                      // );
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

const NewProposal: React.FC<NewProposalProps> = ({ onClickBack }) => {
  const history = useHistory();

  const { daoName } = useParams<any>();
  //TODO daoname empty handling
  const { data: daoList } = useQuery(GET_DAO_BY_NAME, {
    variables: { name: daoName },
  });
  const { enqueueSnackbar } = useSnackbar();
  const { dispatch } = React.useContext(ModalsContext);

  // form
  const methods = useForm<FormInputs>();
  const { getValues, handleSubmit } = methods;

  const [selectedActions, updateSelectedOptions] = useState([]);
  const [isInputModalOpen, setInputModalOpen] = useState(false);
  const [isActionModalOpen, setActionModalOpen] = useState(false);
  const [daoDetails, updateDaoDetails] = useState<any>();
  const [abiFunctions, setAbiFunctions] = useState([]);
  const [actionsToSchedule, setActionsToSchedule] = useState([]);

  useEffect(() => {
    if (daoList) {
      updateDaoDetails(daoList.daos[0]);
    }
  }, [daoList]);

  const context: any = useWallet();
  const { account, provider, isConnected } = context;

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
    // if (actionsToSchedule.length === 0) {
    //   enqueueSnackbar('At least one action is needed to schedule a proposal.', {
    //     variant: 'error',
    //   });
    //   return false;
    // }
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
    // Upload proof to ipfs if it's a file,
    // otherwise convert it to utf8bytes
    const proofFile = getValues('proofFile');
    const proof = proofFile ? await addToIpfs(proofFile[0]) : toUTF8Bytes(getValues('proof'));

    let containerHash: string | undefined;

    // build the container to schedule.
    const payload = {
      submitter: account.address,
      executor: daoDetails.executor.address,
      actions: actions,
      proof: proof,
    };

    // the final container to be sent to schedule.
    const container = buildContainer(payload, daoDetails.queue.config);

    if (proposalInstance) {
      try {
        transactionsQueue.current = await proposalInstance.schedule(container);
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
    }

    dispatch({
      type: ActionTypes.OPEN_TRANSACTIONS_MODAL,
      payload: {
        transactionList: transactionsQueue.current,
        onTransactionFailure: (error) => {
          enqueueSnackbar(error, { variant: 'error' });
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
    <>
      <WrapperDiv>
        <BackButton onClick={onClickBack}>
          <img src={backButtonIcon} />
        </BackButton>
        <Title>New Proposal</Title>
        <SettingsLink>
          This execution will use the current{' '}
          <a style={{ cursor: 'pointer' }} onClick={() => history.push(settingsUrl(daoName))}>
            DAO Settings
          </a>
        </SettingsLink>
        <FormProvider {...methods}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginBottom: '10px',
            }}
          >
            <div>
              <SubTitle>Proof</SubTitle>{' '}
            </div>
            <div style={{ marginLeft: '10px' }}>
              {
                <HelpButton helpText="Please provide the reasons why this proposal deserves to be executed" />
              }
            </div>
          </div>

          <IPFSInput
            label="Enter the justification for changes"
            placeholder="Justification Reason..."
            textInputName="proof"
            fileInputName="proofFile"
          />

          <Title>Actions</Title>
          {selectedActions.length === 0 ? (
            <SubTitle>No actions defined Yet</SubTitle>
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
          <ANButton
            label="Add new action"
            // width={155}
            // height={45}
            buttonType="secondary"
            labelColor="#00C2FF"
            style={{ marginTop: 40 }}
            onClick={handleInputModalOpen}
          />
          <br />
          <ANButton
            label="Schedule/Submit"
            disabled={!isConnected}
            // width={178}
            // height={45}
            buttonType="primary"
            // color="#00C2FF"
            style={{ marginTop: 16 }}
            // disabled={!isProposalValid()}
            onClick={handleSubmit(() => onSchedule())}
          />
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
      </WrapperDiv>
    </>
  );
};

export default memo(NewProposal);
