import React, { useEffect } from 'react';
import { CreateDaoSteps, accordionItems, stepsNames } from './utils/Shared';
import { useCreateDaoContext } from './utils/CreateDaoContextProvider';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { validateToken, validateAmountForDecimals } from 'utils/validations';
import { useWallet } from 'AugmentedWallet';
import { getTokenInfo } from 'utils/token';
import { formatUnits } from 'utils/lib';

import {
  useLayout,
  Grid,
  GridItem,
  Accordion,
  TextInput,
  ContentSwitcher,
  Box,
  Button,
  StyledText,
  Steps,
  Split,
  Info,
  IconMinus,
  IconPlus,
  IconArrowLeft,
  SPACING,
} from '@aragon/ui';

const CreateDaoCollateral: React.FC<{
  setActiveStep: React.Dispatch<React.SetStateAction<CreateDaoSteps>>;
}> = ({ setActiveStep }) => {
  const { layoutName } = useLayout();
  const spacing = SPACING[layoutName];
  const { collaterals, setCollaterals } = useCreateDaoContext();
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

  const context: any = useWallet();
  const { provider } = context;

  const methods = useForm<any>({
    defaultValues: {
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'executionAddressList',
  });

  useEffect(() => {
    setValue('scheduleAmount', formatUnits(scheduleAmount, scheduleDecimals));
    setValue('challengeAmount', formatUnits(challengeAmount, challengeDecimals));
  }, [scheduleAmount, scheduleDecimals, challengeAmount, challengeDecimals, setValue]);

  const moveToNextStep = async () => {
    await trigger();

    if (Object.keys(errors).length > 0) return;

    const data = { ...getValues() };
    data.executionAddressList = data.executionAddressList.map((item: any) => item.value);

    setCollaterals(data);
    setActiveStep(CreateDaoSteps.Review);
  };

  return (
    <Grid layout={true}>
      <GridItem gridColumn={'1/13'} gridRow={'1/4'}>
        <Box>
          <div style={{ display: 'grid', gridGap: spacing }}>
            <Grid columns={'4'} columnWidth={'1fr'}>
              <GridItem gridColumn={'2/5'}>
                <Steps steps={stepsNames} activeIdx={2} showProgress={true} />
              </GridItem>
              <GridItem gridColumn={'1/2'} gridRow={'1'} alignVertical={'center'}>
                <StyledText name={'title2'}>Create DAO</StyledText>
              </GridItem>
            </Grid>

            <div>
              <StyledText name={'title4'}>Collaterals</StyledText>
              <StyledText name={'body3'}>
                In order to schedule or challenge executions, any member must provide this amount of
                collateral, so they have stake in the game and act with the best interest of your
                DAO. By{' '}
                <StyledText name={'body1'} style={{ display: 'inline' }}>
                  default Aragon Console uses DAI
                </StyledText>{' '}
                as a collateral token. If you want to change this, provide another contract address
                in or use your newly created DAO Token.
              </StyledText>
            </div>

            <Info mode={'warning'} title={''}>
              Hey, this is an important step, please check that all the information entered is
              correct.
            </Info>
            <div>
              <StyledText name={'title4'}>Schedule execution collateral token</StyledText>
              <StyledText name={'body3'}>
                Which token do you want to use for schedule execution?
              </StyledText>

              <Controller
                name="isScheduleNewDaoToken"
                control={control}
                defaultValue={isScheduleNewDaoToken}
                render={({ field: { onChange, value } }) => (
                  <ContentSwitcher
                    onChange={onChange}
                    selected={value}
                    items={['New Token', 'Existing Token']}
                    paddingSettings={{
                      horizontal: spacing * 2,
                      vertical: spacing / 4,
                    }}
                  />
                )}
              />

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
                        ? 'The contract address will be avaible after the creation process'
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
              <StyledText name={'title4'}>Challenge collateral token</StyledText>
              <StyledText name={'body3'}>
                Which token do you want to use for challange collateral?
              </StyledText>
              <Controller
                name="isChallengeNewDaoToken"
                control={control}
                defaultValue={isChallengeNewDaoToken}
                render={({ field: { onChange, value } }) => (
                  <ContentSwitcher
                    onChange={onChange}
                    selected={value}
                    items={['New Token', 'Existing Token']}
                    paddingSettings={{
                      horizontal: spacing * 2,
                      vertical: spacing / 4,
                    }}
                  />
                )}
              />
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
                        ? 'The contract address will be avaible after the creation process'
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
              <StyledText name={'title4'}>Schedule execution permissions</StyledText>
              <StyledText name={'body3'}>
                If you want you can define the list of addresses that have permission to schedule
                executions in your DAO, so it is not open for anyone
              </StyledText>

              <Controller
                name="isAnyAddress"
                control={control}
                defaultValue={isAnyAddress}
                render={({ field: { onChange, value } }) => (
                  <ContentSwitcher
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
                If you select ”Any Address”, then everybody can schedule executions in your DAO.
                Please be sure you understand the impact of this selection.
              </Info>
            ) : (
              <div>
                {fields.map((item: any, index: any) => {
                  return (
                    <Split
                      key={item.id}
                      primary={
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
                            />
                          )}
                        />
                      }
                      secondary={
                        <Button
                          mode={'secondary'}
                          size={'large'}
                          disabled={fields.length === 1}
                          icon={<IconMinus />}
                          onClick={() => {
                            remove(index);
                          }}
                        />
                      }
                    />
                  );
                })}
                <Button
                  mode={'secondary'}
                  size={'large'}
                  disabled={executionAddressList.length === 10}
                  label={'Add new address'}
                  icon={<IconPlus />}
                  display={'all'}
                  onClick={() => {
                    append({ value: '' });
                  }}
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
                  label={'back'}
                  display={'all'}
                />
              }
              secondary={
                <Button wide size={'large'} mode={'secondary'} onClick={moveToNextStep}>
                  Next Step
                </Button>
              }
            />
          </div>
        </Box>
      </GridItem>
      <GridItem
        gridRow={layoutName === 'large' ? '1' : undefined}
        gridColumn={layoutName === 'large' ? '13/17' : '1 / -1'}
      >
        <Accordion items={accordionItems}></Accordion>
      </GridItem>
      <GridItem
        gridRow={layoutName === 'large' ? '2' : undefined}
        gridColumn={layoutName === 'large' ? '13/17' : '1 / -1'}
      >
        <Box style={{ background: '#8991FF', opacity: 0.5 }}>
          <h5 style={{ color: '#20232C' }}>Need Help?</h5>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default CreateDaoCollateral;
