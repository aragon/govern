import {
  GU,
  Box,
  Grid,
  Button,
  useTheme,
  GridItem,
  useToast,
  useLayout,
  StyledText,
} from '@aragon/ui';
import styled from 'styled-components';
import { DaoConfig } from '@aragon/govern';
import { buildConfig } from 'utils/ERC3000';
import { ContractReceipt } from 'ethers';
import { useHistory, useParams } from 'react-router-dom';
import { Proposal, ReceiptType } from '@aragon/govern';
import { useForm, FormProvider } from 'react-hook-form';
import { useState, memo, useEffect, useRef, useContext } from 'react';

import Resolver from './components/Resolver';
import Collaterals from './components/Collaterals';
import { useWallet } from 'providers/AugmentedWallet';
import { IPFSInput } from 'components/Field/IPFSInput';
import ExecutionDelay from './components/ExecutionDelay';
import { useDaoQuery } from 'hooks/query-hooks';
import { toUTF8String } from 'utils/lib';
import RulesAndAgreement from './components/RulesAndAgreement';
import { useFacadeProposal } from 'hooks/proposal-hooks';
import { proposalDetailsUrl } from 'utils/urls';
import { addToIpfs, fetchIPFS } from 'utils/ipfs';
import { formatUnits, parseUnits } from 'utils/lib';
import { ActionTypes, ModalsContext } from 'containers/HomePage/ModalsContext';
import { CustomTransaction, ipfsMetadata as IPFSMetadataType } from 'utils/types';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${2 * GU}px;
  align-items: space-between;
`;

const Container = styled(Box)`
  border-radius: 16px;
`;

const SubmitButton = styled(Button)`
  padding: 8px 12px;
  margin-bottom: ${GU}px;
`;

interface ParamTypes {
  /**
   * type of path (url) params
   */
  daoName: string;
}

interface FormInputs {
  daoConfig: DaoConfig;
  proof: string;
  isRuleFile: boolean;
  rulesFile: any;
  proofFile: any;
  delaySelectedIndex: number;
  delayInputValue: number;
}

type DaoAddressState = {
  executorAddress: string;
  token: string;
  queue: string;
};

const DEF_DAO_ADDRESS_STATE = {
  executorAddress: '',
  token: '',
  queue: '',
};

const DaoSettings: React.FC = () => {
  const history = useHistory();
  const { daoName } = useParams<ParamTypes>();

  const toast = useToast();
  const { layoutName } = useLayout();
  const { disabledContent } = useTheme();

  const methods = useForm<FormInputs>();
  const { control, setValue, getValues, handleSubmit, trigger } = methods;

  const { account, isConnected, provider } = useWallet();
  const { dispatch } = useContext(ModalsContext);

  /**
   * State
   */
  const transactionsQueue = useRef<CustomTransaction[]>([]);
  const [config, setConfig] = useState<any>(undefined);
  const [daoDetails, updateDaoDetails] = useState<any>();
  const [daoAddresses, setDaoAddresses] = useState<DaoAddressState>(DEF_DAO_ADDRESS_STATE);
  const [ipfsMetadata, setIpfsMetadata] = useState<IPFSMetadataType>();
  const [resolverLock, setResolverLock] = useState(false);
  const [ipfsRulesLoading, setIpfsRulesLoading] = useState<boolean>(true);
  const [scheduleDecimals, setScheduleDecimals] = useState<number>(0);
  const [challengeDecimals, setChallengeDecimals] = useState<number>(0);

  /**
   * Effects
   */
  const proposalInstance = useFacadeProposal(
    daoDetails?.queue.address,
    daoDetails?.queue.config.resolver,
  );
  const { data: dao, loading: daoIsLoading } = useDaoQuery(daoName);

  useEffect(() => {
    if (dao) updateDaoDetails(dao);
  }, [dao]);

  useEffect(() => {
    return function cleanUp() {
      transactionsQueue.current = [];
    };
  }, []);

  useEffect(() => {
    const _loadRules = async (rules: string) => {
      // config.rules IPFS handling with utf8string fallback.
      const ipfsRules = await fetchIPFS(rules);
      setIpfsRulesLoading(false);
      if (ipfsRules) {
        setIpfsMetadata(ipfsRules);
        setValue('daoConfig.rules', ipfsRules.text || '');
      } else {
        setValue('daoConfig.rules', toUTF8String(rules) || rules);
      }
    };

    const _load = async () => {
      // config is also used as a check in order to set and populate
      // the UI with current Dao's config only once
      if (daoDetails && provider && !config && setValue) {
        const _config = daoDetails.queue.config;
        const _daoAddresses = {
          executorAddress: daoDetails.executor.address,
          token: daoDetails.token,
          queue: daoDetails.queue.address,
        };
        setConfig(_config);
        setDaoAddresses(_daoAddresses);

        // copy the nested objects so we can change the amount values
        const formConfig = buildConfig(_config);

        setScheduleDecimals(_config.scheduleDeposit.decimals);
        setChallengeDecimals(_config.challengeDeposit.decimals);

        // can/should be extracted in the transformProposals in useQuery hooks.
        formConfig.scheduleDeposit.amount = formatUnits(
          _config.scheduleDeposit.amount,
          _config.scheduleDeposit.decimals,
        );
        formConfig.challengeDeposit.amount = formatUnits(
          _config.challengeDeposit.amount,
          _config.challengeDeposit.decimals,
        );
        setValue('daoConfig', formConfig);
        _loadRules(_config.rules);
      }
    };
    _load();
  }, [daoDetails, provider, config, setValue]);

  /**
   * Functions
   */
  const updateResolverLock = (lock: boolean) => {
    if (!lock) {
      setValue('daoConfig.resolver', config.resolver);
    }
    setResolverLock(lock);
  };

  const getRule = async (isRuleFile: number | boolean, textRule: string) => {
    if (Number(isRuleFile) === 1) {
      if (getValues('rulesFile') instanceof FileList) {
        return await addToIpfs(getValues('rulesFile')[0]);
      }
    } else {
      if (textRule !== ipfsMetadata?.text) {
        return await addToIpfs(textRule);
      }
    }
    return config.rules;
  };

  const callSaveSetting = async (formData: FormInputs) => {
    const newConfig: DaoConfig = formData.daoConfig;
    let containerHash: string | undefined;

    newConfig.rules = await getRule(getValues('isRuleFile'), newConfig.rules.toString());

    // Upload proof to ipfs
    const proof = getValues('proofFile') ? getValues('proofFile')[0] : getValues('proof');
    const proofCid = await addToIpfs(proof, {
      title: 'DAO Configuration change',
    });

    // if the amount contains `.`, means it's a fractional component
    // and we need to parse it to bignumber again for smart contract
    if (newConfig.scheduleDeposit.amount.toString().includes('.')) {
      newConfig.scheduleDeposit.amount = parseUnits(
        newConfig.scheduleDeposit.amount,
        scheduleDecimals,
      );
    }
    if (newConfig.challengeDeposit.amount.toString().includes('.')) {
      newConfig.challengeDeposit.amount = parseUnits(
        newConfig.challengeDeposit.amount,
        challengeDecimals,
      );
    }

    // payload for the final container
    const payload = {
      submitter: account.address + '',
      executor: daoDetails.executor.address,
      actions: [proposalInstance?.buildAction('configure', [newConfig], 0)],
      proof: proofCid,
    };

    if (proposalInstance) {
      try {
        transactionsQueue.current = await proposalInstance.schedule(payload, buildConfig(config));
      } catch (error: any) {
        toast(error.message);
        return;
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

  /**
   * Render
   */
  return (
    <Container>
      <Grid gap={3 * GU}>
        <GridItem>
          <StyledText name={'title1'}>Settings</StyledText>
          <StyledText name={'title4'} style={{ color: disabledContent }}>
            The DAO settings will be changed by scheduling an action like any other in Govern. Make
            sure you know the implications of changing any of the following settings, as some
            incorrect information may lock your DAO.
          </StyledText>
        </GridItem>

        <FormProvider {...methods}>
          <GridItem>
            <Resolver
              control={control}
              provider={provider}
              resolverLock={resolverLock}
              tokenAddress={daoAddresses.token}
              queueAddress={daoAddresses.queue}
              executorAddress={daoAddresses.executorAddress}
              onResolverLockChange={updateResolverLock}
            />
          </GridItem>
          <GridItem>
            <StyledDiv>
              <ExecutionDelay
                isLoading={daoIsLoading}
                delayInSeconds={daoDetails?.queue?.config?.executionDelay}
              />
              <RulesAndAgreement isLoading={ipfsRulesLoading} ipfsMetadata={ipfsMetadata} />
            </StyledDiv>
          </GridItem>
          <GridItem>
            <Collaterals
              control={control}
              provider={provider}
              onTrigger={trigger}
              scheduleDecimals={scheduleDecimals}
              challengeDecimals={challengeDecimals}
              onScheduleDepositChange={setScheduleDecimals}
              onChallengeDecimalsChange={setChallengeDecimals}
            />
          </GridItem>
          <GridItem>
            <IPFSInput
              rows={4}
              title="Justification for change of settings"
              subtitle="Insert the reason for scheduling this change of settings, so DAO members can understand it."
              placeholder="Please insert the reason why you want to execute this"
              textInputName="proof"
              fileInputName="proofFile"
            />
          </GridItem>
          <GridItem>
            <SubmitButton
              size={layoutName}
              label={'Schedule configuration changes'}
              onClick={handleSubmit(callSaveSetting)}
              disabled={!isConnected}
              buttonType={'primary'}
            />
          </GridItem>
        </FormProvider>
      </Grid>
    </Container>
  );
};

export default memo(DaoSettings);
