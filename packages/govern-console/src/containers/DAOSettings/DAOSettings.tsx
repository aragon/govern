import React, { useState, memo, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import backButtonIcon from '../../images/back-btn.svg';
import { styled } from '@material-ui/core/styles';
import { buildConfig } from 'utils/ERC3000';
import { useWallet } from 'AugmentedWallet';
import { DaoConfig } from '@aragon/govern';
import { CustomTransaction } from 'utils/types';
import { ActionTypes, ModalsContext } from 'containers/HomePage/ModalsContext';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { ContractReceipt } from 'ethers';
import { validateToken, validateContract, validateAmountForDecimals } from 'utils/validations';
import { Proposal, ReceiptType } from '@aragon/govern';
import { useSnackbar } from 'notistack';
import { toUTF8String } from 'utils/lib';
import { proposalDetailsUrl } from 'utils/urls';
import { addToIpfs, fetchIPFS } from 'utils/ipfs';
import { IPFSInput } from 'components/Field/IPFSInput';
import { useFacadeProposal } from 'hooks/proposal-hooks';
import { useDaoQuery } from 'hooks/query-hooks';
import { ipfsMetadata } from 'utils/types';
import { formatUnits, parseUnits } from 'utils/lib';
import { getTokenInfo } from 'utils/token';
import { positiveNumber } from 'utils/validations';

import cardMainImage from '../../images/pngs/dao_setting_@2x.png';

import {
  useLayout,
  Grid,
  GridItem,
  EmptyStateCard,
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

export interface DaoSettingFormProps {
  /**
   * on click back
   */
  onClickBack: () => void;
}

interface ParamTypes {
  /**
   * type of path (url) params
   */
  daoName: string;
}

interface FormInputs {
  daoConfig: DaoConfig;
  proof: string;
  rulesFile: any;
  proofFile: any;
}

const BackButton = styled('div')({
  height: 25,
  width: 62,
  cursor: 'pointer',
  position: 'relative',
  left: 0,
});

const DaoSettings: React.FC<DaoSettingFormProps> = () => {
  const theme = useTheme();
  const { layoutName } = useLayout();
  const spacing = SPACING[layoutName];
  const history = useHistory();
  const context: any = useWallet();
  const { account, isConnected, provider } = context;
  const { dispatch } = React.useContext(ModalsContext);
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm<FormInputs>();
  const { control, setValue, getValues, handleSubmit, trigger } = methods;
  const { daoName } = useParams<ParamTypes>();
  //TODO daoname empty handling
  const { data: dao } = useDaoQuery(daoName);
  const [daoDetails, updateDaoDetails] = useState<any>();
  const [config, setConfig] = useState<any>(undefined);
  const [daoAddresses, setDaoAddresses] = useState<{ executorAddress: string; token: string }>({
    executorAddress: '',
    token: '',
  });
  const [ipfsMetadata, setIpfsMetadata] = useState<ipfsMetadata>();
  const [scheduleDecimals, setScheduleDecimals] = useState<number>(0);
  const [challengeDecimals, setChallengeDecimals] = useState<number>(0);
  const [resolverLock, setResolverLock] = useState(false);
  const cardText = (
    <div>
      <StyledText name={'title2'}>Your DAO settings</StyledText>
      <StyledText name={'body2'}>
        Message about the importancy of permissions on your DAO, bla bla, explaining the settings
        etc.
      </StyledText>
    </div>
  );
  const cardIamge = <img style={{ width: '150px' }} src={cardMainImage}></img>;

  const updateResolverLock = (lock: boolean) => {
    if (!lock) {
      setValue('daoConfig.resolver', config.resolver);
    }
    setResolverLock(lock);
  };

  useEffect(() => {
    if (dao) {
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
        // config.rules IPFS handling with utf8string fallback.
        const ipfsRules = await fetchIPFS(_config.rules);
        if (ipfsRules) {
          setIpfsMetadata(ipfsRules);
          formConfig.rules = ipfsRules.text || '';
        } else {
          formConfig.rules = toUTF8String(_config.rules) || _config.rules;
        }

        setValue('daoConfig', formConfig);
      }
    };
    _load();
  }, [daoDetails, provider, config, setValue]);

  const callSaveSetting = async (formData: FormInputs) => {
    const newConfig: DaoConfig = formData.daoConfig;
    let containerHash: string | undefined;

    // Upload rules to ipfs
    const rules = getValues('rulesFile') ? getValues('rulesFile')[0] : newConfig.rules.toString();
    // console.log(getValues('rulesFile'), ' rulesfile');
    newConfig.rules = await addToIpfs(rules);

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
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
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
    <Grid layout={true}>
      <GridItem gridColumn={'1/13'} gridRow={layoutName === 'large' ? '1/4' : '2'}>
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
                <StyledText name={'title4'}>Resolver</StyledText>
                <StyledText name={'body3'}>
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
              <Controller
                name="daoConfig.executionDelay"
                control={control}
                defaultValue={''}
                rules={{
                  required: 'This is required.',
                  validate: (value) => positiveNumber(value),
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextInput
                    title={'Execution Delay'}
                    subtitle={
                      'Amount of time any action in your DAO will be available to be challenged before bein executed'
                    }
                    type="number"
                    onChange={onChange}
                    value={value.toString()}
                    wide
                    placeholder={'350s'}
                    status={!!error ? 'error' : 'normal'}
                    error={error ? error.message : null}
                  />
                )}
              />

              <IPFSInput
                title={'Rules / Agreement'}
                subtitle="Your DAO have optimistic capabilities, meaning that actions can happen without voting, but should follow pre defined rules. Please provide the main agreement for your DAO (In text, or upload a file)."
                placeholder="DAO rules and agreement.."
                ipfsMetadata={ipfsMetadata}
                shouldUnregister={false}
                textInputName="daoConfig.rules"
                fileInputName="rulesFile"
              />

              <div>
                <StyledText name={'title2'}>Collaterals</StyledText>
                <StyledText name={'body2'} style={{ color: theme.disabledContent }}>
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
                    onInputChange={onChange}
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
                subtitle="Please provide the reasons for this DAO settings change as this will trigger an action on the executor queue"
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
      </GridItem>
      <GridItem
        gridRow={'1'}
        gridColumn={layoutName === 'large' ? '13/17' : '1 / -1'}
        alignHorizontal={'center'}
      >
        <EmptyStateCard illustration={cardIamge} text={cardText} />
      </GridItem>
      <GridItem
        gridRow={layoutName === 'large' ? '2' : '3'}
        gridColumn={layoutName === 'large' ? '13/17' : '1 / -1'}
      >
        <Box style={{ background: '#8991FF', opacity: 0.5 }}>
          <h5 style={{ color: '#20232C' }}>Need Help?</h5>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default memo(DaoSettings);
