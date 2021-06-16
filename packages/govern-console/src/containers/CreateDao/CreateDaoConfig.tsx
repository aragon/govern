import React, { useState, useEffect } from 'react';
import { CreateDaoSteps, accordionItems, stepsNames } from './utils/Shared';
import { useCreateDaoContext, ICreateDaoConfig } from './utils/CreateDaoContextProvider';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { validateContract } from 'utils/validations';
import { useWallet } from 'AugmentedWallet';
import { IPFSInput } from 'components/Field/IPFSInput';

import {
  useLayout,
  Grid,
  GridItem,
  Accordion,
  TextInput,
  Checkbox,
  Box,
  Button,
  StyledText,
  Steps,
  IconBlank,
  Info,
  Link,
  SPACING,
  IconArrowLeft,
  Split,
} from '@aragon/ui';

const CreateDaoConfig: React.FC<{
  setActiveStep: React.Dispatch<React.SetStateAction<CreateDaoSteps>>;
}> = ({ setActiveStep }) => {
  const { layoutName } = useLayout();
  const spacing = SPACING[layoutName];
  const [resolverLock, setResolverLock] = useState(false);
  const { config, setConfig } = useCreateDaoContext();
  const { executionDelay, isRuleFile, ruleFile, ruleText, resolver } = config;

  const context: any = useWallet();
  const { provider } = context;

  const methods = useForm<ICreateDaoConfig>();
  const { control, setValue, getValues, trigger } = methods;

  const updateResolverLock = (lock: boolean) => {
    if (!lock) {
      setValue('resolver', resolver);
    }
    setResolverLock(lock);
  };

  useEffect(() => {
    setValue('ruleText', ruleText);
    setValue('isRuleFile', isRuleFile);
    setValue('ruleFile', ruleFile);
  }, [ruleText]);

  const moveToNextStep = async () => {
    const validate = await trigger();

    if (!validate) return;

    const newConfig = { ...config, ...getValues() };

    setConfig(newConfig);
    setActiveStep(CreateDaoSteps.Collateral);
  };

  return (
    <Grid layout={true}>
      <GridItem gridColumn={'1/13'} gridRow={'1/4'}>
        <Box>
          <Grid columns={'4'} columnWidth={'1fr'}>
            <GridItem gridColumn={'2/5'}>
              <Steps steps={stepsNames} activeIdx={1} showProgress={true} />
            </GridItem>
            <GridItem gridColumn={'1/2'} gridRow={'1'} alignVertical={'center'}>
              <StyledText name={'title2'}>Create DAO</StyledText>
            </GridItem>
          </Grid>

          <StyledText name={'title4'}>Execution delay</StyledText>
          <StyledText name={'body3'}>
            Amount of time any action in your DAO will be available to be challenged before bein
            executed
          </StyledText>
          <Controller
            name="executionDelay"
            control={control}
            defaultValue={executionDelay}
            rules={{
              required: 'This is required.',
              validate: (value) => (parseInt(value) > 0 ? true : 'Value must be positive'),
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextInput.Titled
                wide
                value={value}
                placeholder={'Amount'}
                onChange={onChange}
                status={!!error ? 'error' : 'normal'}
                error={error ? error.message : null}
              />
            )}
          />

          <StyledText name={'title4'} style={{ marginTop: spacing }}>
            Rules / Agreement
          </StyledText>
          <StyledText name={'body3'}>
            Your DAO have optimistic capabilities, meaning that actions can happen without voting,
            but should follow pre defined rules. Please provide the main agreement for your DAO (In
            text, or upload a file).
          </StyledText>
          <FormProvider {...methods}>
            <IPFSInput
              label="Rules in text"
              placeholder="Enter rules"
              // ipfsURI={rulesIpfsUrl?.endpoint}
              shouldUnregister={false}
              isFile="isRuleFile"
              textInputName="ruleText"
              fileInputName="ruleFile"
            />
          </FormProvider>

          <StyledText name={'title4'} style={{ marginTop: spacing }}>
            Resolver
          </StyledText>
          <StyledText name={'body3'}>
            The resolver is a smart contract that can handle disputes in your DAO and follows the
            ERC3k interface. By default your DAO will use Aragon Court as a resolver.{' '}
            <Link href="https://court.aragon.org/">Learn more</Link>
          </StyledText>
          <Box>
            <Grid>
              <GridItem gridColumn={'1/6'} gridRow={'1'}>
                <Controller
                  name="resolver"
                  control={control}
                  defaultValue={resolver}
                  rules={{
                    required: 'This is required.',
                    validate: async (value) => validateContract(value, provider),
                  }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextInput.Titled
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
          <Info
            mode={'warning'}
            title={''}
            style={{
              marginTop: '20px',
            }}
          >
            Hey, this is an important step, please check that all the information entered is
            correct.
          </Info>
          <Split
            width={'100%'}
            primary={
              <Button
                style={{ marginTop: spacing }}
                size={'large'}
                mode={'secondary'}
                onClick={() => {
                  setActiveStep(CreateDaoSteps.BasicInfo);
                }}
                icon={<IconArrowLeft />}
                label={'back'}
                display={'all'}
              />
            }
            secondary={
              <Button
                style={{ marginTop: spacing, width: '100%' }}
                size={'large'}
                mode={'secondary'}
                onClick={moveToNextStep}
              >
                Next Step
              </Button>
            }
          />
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

export default CreateDaoConfig;
