import React, { useEffect } from 'react';
import { CreateDaoSteps } from './utils/Shared';
import { useCreateDaoContext } from './utils/CreateDaoContextProvider';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { validateToken, validateAmountForDecimals } from 'utils/validations';
import { useWallet } from 'AugmentedWallet';
import { getTokenInfo } from 'utils/token';
import { formatUnits } from 'utils/lib';
import { MAX_SCHEDULE_ACCESS_LIST_ALLOWED } from 'utils/constants';
import { constants } from 'ethers';
import {
  useLayout,
  TextInput,
  ContentSwitcher,
  Box,
  Button,
  StyledText,
  Split,
  Info,
  IconMinus,
  IconPlus,
  IconArrowLeft,
  SPACING,
  useTheme,
} from '@aragon/ui';
import StepsHeader from './components/StepsHeader';

const CreateDaoCollateral: React.FC<{
  setActiveStep: React.Dispatch<React.SetStateAction<CreateDaoSteps>>;
}> = ({ setActiveStep }) => {
  const { layoutName } = useLayout();
  const theme = useTheme();
  const spacing = SPACING[layoutName];
  const { collaterals, setCollaterals, basicInfo } = useCreateDaoContext();
  const {
    scheduleAddress,
    scheduleAmount,
    scheduleDecimals,
    isScheduleNewDaoToken,
    challengeAddress,
    challengeAmount,
    challengeDecimals,
    isChallengeNewDaoToken,
    isAnyAddress,
    executionAddressList,
  } = collaterals;

  const isExistingToken = basicInfo.isExistingToken;

  const context: any = useWallet();
  const { provider } = context;

  const methods = useForm<any>({
    defaultValues: {
      isScheduleNewDaoToken,
      isChallengeNewDaoToken,
      executionAddressList: executionAddressList.map((address) => {
        return { value: address };
      }),
    },
  });

  const {
    control,
    watch,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (isExistingToken) {
      setValue('isScheduleNewDaoToken', 0);
      setValue('isChallengeNewDaoToken', 0);
    }
  }, [isExistingToken, setValue]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'executionAddressList',
  });

  useEffect(() => {
    setValue('scheduleAmount', formatUnits(scheduleAmount, scheduleDecimals));
    setValue('challengeAmount', formatUnits(challengeAmount, challengeDecimals));
  }, [scheduleAmount, scheduleDecimals, challengeAmount, challengeDecimals, setValue]);

  useEffect(() => {
    setValue('isAnyAddress', isAnyAddress);
  }, [isAnyAddress, setValue]);

  const moveToNextStep = async () => {
    await trigger();

    if (Object.keys(errors).length > 0) return;

    const data = { ...getValues() };
    data.executionAddressList = data.executionAddressList.map((item: any) => item.value);

    setCollaterals(data);
    setActiveStep(CreateDaoSteps.Review);
  };

  return (
    <Box>
      <div style={{ display: 'grid', gridGap: spacing }}>
        <StepsHeader index={2} />

        <div>
          <StyledText name={'title3'}>Collaterals</StyledText>
          <StyledText name={'title4'} style={{ color: theme.disabledContent }}>
            Collateral is required to schedule or challenge any transaction. The default currency
            for collateral is DAI. To override the default, provide another contract address or use
            your newly created DAO token.
          </StyledText>
        </div>

        <Info mode={'warning'} title={''}>
          Carefully review your collateral contract address. An incorrect address may lock your DAO.
        </Info>
        <div>
          {!isExistingToken && (
            <Controller
              name="isScheduleNewDaoToken"
              control={control}
              defaultValue={isScheduleNewDaoToken}
              render={({ field: { onChange, value } }) => (
                <ContentSwitcher
                  title="Schedule execution collateral token"
                  subtitle="Choose which token may be used to schedule a transaction."
                  onChange={onChange}
                  selected={value}
                  items={['Custom Token', 'New DAO token']}
                  paddingSettings={{
                    horizontal: spacing * 2,
                    vertical: spacing / 4,
                  }}
                />
              )}
            />
          )}

          <Controller
            name="scheduleAddress"
            control={control}
            defaultValue={scheduleAddress}
            rules={{
              required: 'This is required.',
              validate: async (value) => {
                const v = await validateToken(value, provider);
                if (v !== true) {
                  return v;
                }

                let { decimals } = await getTokenInfo(value, provider);
                decimals = decimals || 0;

                setValue('scheduleDecimals', decimals);

                await trigger('scheduleAmount');
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextInput
                subtitle="Token contract address"
                wide
                disabled={watch('isScheduleNewDaoToken')}
                placeholder={
                  watch('isScheduleNewDaoToken')
                    ? 'The contract address will be available after the creation process'
                    : 'Contract address...'
                }
                value={!watch('isScheduleNewDaoToken') ? value : ''}
                onChange={onChange}
                status={!!error ? 'error' : 'normal'}
                error={error ? error.message : null}
              />
            )}
          />

          <Controller
            name="scheduleAmount"
            control={control}
            defaultValue={scheduleAmount}
            rules={{
              required: 'This is required.',
              validate: async (value) =>
                validateAmountForDecimals(value, watch('scheduleDecimals')),
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextInput
                subtitle="Token amount"
                wide
                type={'number'}
                placeholder={'Token amount...'}
                value={value}
                onChange={onChange}
                status={!!error ? 'error' : 'normal'}
                error={error ? error.message : null}
              />
            )}
          />
        </div>

        <div>
          {!isExistingToken && (
            <Controller
              name="isChallengeNewDaoToken"
              control={control}
              defaultValue={isChallengeNewDaoToken}
              render={({ field: { onChange, value } }) => (
                <ContentSwitcher
                  title="Challenge collateral token"
                  subtitle="Choose which token may be used to challenge a transaction."
                  onChange={onChange}
                  selected={value}
                  items={['Custom Token', 'New DAO Token']}
                  paddingSettings={{
                    horizontal: spacing * 2,
                    vertical: spacing / 4,
                  }}
                />
              )}
            />
          )}
          <Controller
            name="challengeAddress"
            control={control}
            defaultValue={challengeAddress}
            rules={{
              required: 'This is required.',
              validate: async (value) => {
                const v = await validateToken(value, provider);
                if (v !== true) {
                  return v;
                }

                let { decimals } = await getTokenInfo(value, provider);
                decimals = decimals || 0;

                setValue('challengeDecimals', decimals);

                await trigger('challengeAmount');
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextInput
                subtitle="Token contract address"
                wide
                disabled={watch('isChallengeNewDaoToken')}
                placeholder={
                  watch('isChallengeNewDaoToken')
                    ? 'The contract address will be available after the creation process'
                    : 'Contract address...'
                }
                value={!watch('isChallengeNewDaoToken') ? value : ''}
                onChange={onChange}
                status={!!error ? 'error' : 'normal'}
                error={error ? error.message : null}
              />
            )}
          />
          <Controller
            name="challengeAmount"
            control={control}
            defaultValue={challengeAmount}
            rules={{
              required: 'This is required.',
              validate: async (value) =>
                validateAmountForDecimals(value, watch('challengeDecimals')),
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextInput
                subtitle="Token amount"
                wide
                type={'number'}
                placeholder={'Token amount...'}
                value={value}
                onChange={onChange}
                status={!!error ? 'error' : 'normal'}
                error={error ? error.message : null}
              />
            )}
          />
        </div>
        <div>
          <Controller
            name="isAnyAddress"
            control={control}
            defaultValue={isAnyAddress}
            render={({ field: { onChange, value } }) => (
              <ContentSwitcher
                title="Whitelist of addresses that may schedule transactions."
                subtitle={
                  <p>
                    Limit the addresses that may schedule transactions.{' '}
                    <span style={{ fontWeight: 600 }}>Caution</span>: if these addresses are
                    incorrect or unavailable, your DAO will be locked.
                  </p>
                }
                onChange={onChange}
                selected={value}
                items={['Address List', 'Any Address']}
                paddingSettings={{
                  horizontal: spacing * 2,
                  vertical: spacing / 4,
                }}
              />
            )}
          />
        </div>
        {watch('isAnyAddress') ? (
          <Info mode={'warning'} title={''}>
            If you select ”Any Address”, then everybody can schedule executions in your DAO. Please
            be sure you understand the impact of this selection.
          </Info>
        ) : (
          <div>
            {fields.map((item: any, index: number) => {
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 16,
                      marginTop: 8,
                    }}
                  >
                    <Controller
                      name={`executionAddressList[${index}].value`}
                      control={control}
                      defaultValue={item.value}
                      rules={{ required: 'This is required.' }}
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextInput
                          wide
                          value={value}
                          onChange={onChange}
                          status={!!error ? 'error' : 'normal'}
                          error={error ? error.message : null}
                          placeholder={constants.AddressZero}
                        />
                      )}
                    />
                    <Button
                      mode={'secondary'}
                      size={'large'}
                      disabled={fields.length === 1}
                      onClick={() => {
                        remove(index);
                      }}
                    >
                      <IconMinus />
                    </Button>
                  </div>
                </div>
              );
            })}
            <Button
              wide={false}
              mode={'secondary'}
              size={'large'}
              disabled={fields.length >= MAX_SCHEDULE_ACCESS_LIST_ALLOWED}
              label={'Add new address'}
              icon={<IconPlus />}
              display={'all'}
              onClick={() => {
                append({ value: '' });
              }}
              style={{ marginTop: 16 }}
            />
          </div>
        )}

        <Split
          width={'100%'}
          primary={
            <Button
              size={'large'}
              mode={'secondary'}
              onClick={() => {
                setActiveStep(CreateDaoSteps.Config);
              }}
              icon={<IconArrowLeft />}
              label={'Back'}
              display={'all'}
            />
          }
          secondary={
            <Button
              wide
              size={'large'}
              mode={'secondary'}
              onClick={moveToNextStep}
              label="Next Step"
            />
          }
        />
      </div>
    </Box>
  );
};

export default CreateDaoCollateral;
