import React, { useState, memo, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import backButtonIcon from '../../images/back-btn.svg';
import { BackButton } from 'styles';
import { buildConfig } from 'utils/ERC3000';
import { useWallet } from 'providers/AugmentedWallet';
import { DaoConfig } from '@aragon/govern';
import { CustomTransaction } from 'utils/types';
import { ActionTypes, ModalsContext } from 'containers/HomePage/ModalsContext';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { ContractReceipt } from 'ethers';
import { validateToken, validateContract, validateAmountForDecimals } from 'utils/validations';
import { Proposal, ReceiptType } from '@aragon/govern';
import { useToast } from '@aragon/ui';
import { toUTF8String } from 'utils/lib';
import { proposalDetailsUrl } from 'utils/urls';
import { addToIpfs, fetchIPFS } from 'utils/ipfs';
import { IPFSInput } from 'components/Field/IPFSInput';
import { useFacadeProposal } from 'hooks/proposal-hooks';
import { useDaoQuery } from 'hooks/query-hooks';
import { ipfsMetadata } from 'utils/types';
import { formatUnits, parseUnits } from 'utils/lib';
import { getTokenInfo } from 'utils/token';
import { ANCircularProgressWithCaption } from 'components/CircularProgress/ANCircularProgressWithCaption';
import { CircularProgressStatus } from 'utils/types';

import {
  useLayout,
  Grid,
  GridItem,
  TextInput,
  TextCopy,
  Box,
  Button,
  StyledText,
  SPACING,
  useTheme,
  Link,
  IconBlank,
  Checkbox,
} from '@aragon/ui';
import PageContent from 'components/PageContent/PageContent';
import SettingsCard from './components/SettingsCard';
import { TimeInterval } from 'components/TimeInterval/TimeInterval';

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

const DaoSettings: React.FC = () => {
  const theme = useTheme();
  const { layoutName } = useLayout();
  const spacing = SPACING[layoutName];
  const history = useHistory();
  const context: any = useWallet();
  const { account, isConnected, provider } = context;
  const { dispatch } = React.useContext(ModalsContext);
  const toast = useToast();
  const methods = useForm<FormInputs>();
  const { control, setValue, getValues, handleSubmit, trigger } = methods;
  const { daoName } = useParams<ParamTypes>();
  //TODO daoname empty handling
  const { data: dao, loading: loadingDaoData } = useDaoQuery(daoName);
  const [daoDetails, updateDaoDetails] = useState<any>();
  const [config, setConfig] = useState<any>(undefined);
  const [daoAddresses, setDaoAddresses] = useState<{ executorAddress: string; token: string }>({
    executorAddress: '',
    token: '',
  });
  const [ipfsMetadata, setIpfsMetadata] = useState<ipfsMetadata>();
  const [ipfsRulesLoading, setIpfsRulesLoading] = useState<boolean>(true);

  const [scheduleDecimals, setScheduleDecimals] = useState<number>(0);
  const [challengeDecimals, setChallengeDecimals] = useState<number>(0);
  const [resolverLock, setResolverLock] = useState(false);

  const updateResolverLock = (lock: boolean) => {
    if (!lock) {
      setValue('daoConfig.resolver', config.resolver);
    }
    setResolverLock(lock);
  };

  useEffect(() => {
    if (dao) {
      // console.log('getInterval', getInterval(dao.queue?.config?.executionDelay));
      updateDaoDetails(dao);
    }
  }, [dao]);

  const proposalInstance = useFacadeProposal(
    daoDetails?.queue.address,
    daoDetails?.queue.config.resolver,
  );

  const transactionsQueue = React.useRef<CustomTransaction[]>([]);

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
      submitter: account.address,
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

  return (
    <PageContent card={<SettingsCard />}>
      <Box>
        <BackButton onClick={() => history.goBack()}>
          <img src={backButtonIcon} />
        </BackButton>
        <div style={{ display: 'grid', gridGap: spacing }}>
          <StyledText name={'title1'}>DAO Settings</StyledText>
          <TextCopy title={'DAO Govern Executor Address'} value={daoAddresses.executorAddress} />
          <TextCopy title={'DAO Token address'} value={daoAddresses.token} />
          <FormProvider {...methods}>
            <div>
              <StyledText name={'title3'}>Resolver</StyledText>
              <StyledText name={'title4'} style={{ color: theme.disabledContent }}>
                The resolver is a smart contract that can handle disputes in your DAO and follows
                the ERC3k interface. By default your DAO will use Aragon Court as a resolver.{' '}
                <Link href="https://court.aragon.org/">Learn more</Link>
              </StyledText>
              <Box>
                <Grid>
                  <GridItem gridColumn={'1/6'} gridRow={'1'}>
                    <Controller
                      name="daoConfig.resolver"
                      control={control}
                      defaultValue={''}
                      rules={{
                        required: 'This is required.',
                        validate: (value) => {
                          return validateContract(value, provider);
                        },
                      }}
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextInput
                          wide
                          disabled={!resolverLock}
                          value={value}
                          placeholder={'Resolver address'}
                          adornment={<IconBlank />}
                          adornmentPosition="end"
                          onChange={onChange}
                          status={!!error ? 'error' : 'normal'}
                          error={error ? error.message : null}
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem
                    gridColumn={'6/7'}
                    gridRow={'1'}
                    alignVertical={'center'}
                    alignHorizontal={'center'}
                  >
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Checkbox
                        checked={resolverLock}
                        onChange={() => updateResolverLock(!resolverLock)}
                      />
                      <span
                        style={{
                          marginLeft: '4px',
                        }}
                      >
                        Override default resolver
                      </span>
                    </label>
                  </GridItem>
                </Grid>
              </Box>
            </div>

            {loadingDaoData ? (
              <ANCircularProgressWithCaption
                caption="Fetching Execution delay"
                state={CircularProgressStatus.InProgress}
              />
            ) : (
              <TimeInterval
                title="Execution delay"
                subtitle="Amount of time any transaction in your DAO will be available to be disputed by your members before being executed."
                placeholder={'Amount'}
                inputName="delayInputValue"
                dropdownName="delaySelectedIndex"
                resultName="daoConfig.executionDelay"
                shouldUnregister={false}
                timeInSeconds={daoDetails?.queue?.config?.executionDelay}
              />
            )}

            {ipfsRulesLoading ? (
              <ANCircularProgressWithCaption
                caption="Fetching Rules from IPFS"
                state={CircularProgressStatus.InProgress}
              />
            ) : (
              <IPFSInput
                title={'Rules / Agreement'}
                subtitle={
                  <StyledText name={'title4'} style={{ color: theme.disabledContent }}>
                    Your DAO has optimistic capabilities, meaning that transactions can happen
                    without voting, but should follow pre defined rules. Please provide the main
                    agreement for your DAO (In text, or upload a file). You can use{' '}
                    <Link href="https://docs.google.com/document/d/1HkSiJtjqiTCMbCagn2ev5iv_fG_PpfJcI-NqebmQzng/">
                      this template
                    </Link>{' '}
                    to create your agreement.
                  </StyledText>
                }
                placeholder="Please insert your DAO agreement"
                ipfsMetadata={ipfsMetadata}
                shouldUnregister={false}
                textInputName="daoConfig.rules"
                fileInputName="rulesFile"
                isFile="isRuleFile"
                rows={6}
              />
            )}

            <div>
              <StyledText name={'title3'}>Collaterals</StyledText>
              <StyledText name={'title4'} style={{ color: theme.disabledContent }}>
                {
                  'In order to schedule or challenge executions, any member must provide this amount of collateral, so they have stake in the game and act with the best interest of your DAO'
                }
              </StyledText>
            </div>

            <Controller
              name="daoConfig.scheduleDeposit.token"
              control={control}
              defaultValue=""
              rules={{
                required: 'This is required.',
                validate: async (value) => {
                  const v = await validateToken(value, provider);
                  if (v !== true) {
                    return v;
                  }

                  let { decimals } = await getTokenInfo(value, provider);
                  decimals = decimals || 0;

                  setScheduleDecimals(decimals);
                  await trigger('daoConfig.scheduleDeposit.amount');
                },
              }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextInput
                  title="Schedule execution collateral"
                  onChange={onChange}
                  value={value}
                  wide
                  placeholder={'0x'}
                  status={!!error ? 'error' : 'normal'}
                  error={error ? error.message : null}
                />
              )}
            />
            <Controller
              name="daoConfig.scheduleDeposit.amount"
              control={control}
              defaultValue={''}
              rules={{
                required: 'This is required.',
                validate: (value) => validateAmountForDecimals(value, scheduleDecimals),
              }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextInput
                  title={'Token amount'}
                  type="number"
                  onChange={onChange}
                  value={value.toString()}
                  wide
                  placeholder={'10.0'}
                  status={!!error ? 'error' : 'normal'}
                  error={error ? error.message : null}
                />
              )}
            />
            <Controller
              name="daoConfig.challengeDeposit.token"
              control={control}
              defaultValue=""
              rules={{
                required: 'This is required.',
                validate: async (value) => {
                  const v = await validateToken(value, provider);
                  if (v !== true) {
                    return v;
                  }

                  let { decimals } = await getTokenInfo(value, provider);
                  decimals = decimals || 0;

                  setChallengeDecimals(decimals);

                  await trigger('daoConfig.challengeDeposit.amount');
                },
              }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextInput
                  title="Challenge collateral token contract address"
                  onChange={onChange}
                  value={value}
                  wide
                  placeholder={'0x'}
                  status={!!error ? 'error' : 'normal'}
                  error={error ? error.message : null}
                />
              )}
            />
            <Controller
              name="daoConfig.challengeDeposit.amount"
              control={control}
              defaultValue={''}
              rules={{
                required: 'This is required.',
                validate: (value) => validateAmountForDecimals(value, challengeDecimals),
              }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextInput
                  type="number"
                  title="Token amount"
                  onChange={onChange}
                  value={value.toString()}
                  wide
                  placeholder={'10.0'}
                  status={!!error ? 'error' : 'normal'}
                  error={error ? error.message : null}
                />
              )}
            />
            {/* <Controller
                name="daoConfig.resolver"
                control={control}
                defaultValue={''}
                rules={{
                  required: 'This is required.',
                  validate: (value) => {
                    return validateContract(value, provider);
                  },
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextInput
                    title="Resolver"
                    subtitle="Contract Address"
                    onChange={onChange}
                    value={value}
                    wide
                    placeholder={'0x'}
                    status={!!error ? 'error' : 'normal'}
                    error={error ? error.message : null}
                  />
                )}
              /> */}
            <IPFSInput
              title="Justification"
              subtitle="Provide reasons for this DAO settings change as this will trigger a transaction on the executor queue that may be challenged in Court."
              placeholder="Please insert the reason why you want to execute this"
              textInputName="proof"
              fileInputName="proofFile"
            />

            <div
              style={{
                justifyContent: 'center',
                display: 'flex',
              }}
            >
              <Button
                size={layoutName}
                disabled={!isConnected}
                label={'Schedule configuration changes'}
                buttonType={'primary'}
                onClick={handleSubmit(callSaveSetting)}
                wide
              />
            </div>
          </FormProvider>
        </div>
      </Box>
    </PageContent>
  );
};

export default memo(DaoSettings);
