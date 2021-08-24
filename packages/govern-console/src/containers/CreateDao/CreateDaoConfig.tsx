import React, { useEffect } from 'react';
import { CreateDaoSteps } from './utils/Shared';
import { useCreateDaoContext, ICreateDaoConfig } from './utils/CreateDaoContextProvider';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { validateContract } from 'utils/validations';
import { useWallet } from 'AugmentedWallet';
import { IPFSInput } from 'components/Field/IPFSInput';
import { networkEnvironment } from 'environment';

import {
  useLayout,
  Grid,
  GridItem,
  TextInput,
  Checkbox,
  Box,
  Button,
  StyledText,
  IconBlank,
  Info,
  Link,
  SPACING,
  IconArrowLeft,
  Split,
  useTheme,
} from '@aragon/ui';
import StepsHeader from './components/StepsHeader';
import { TimeInterval } from 'components/TimeInterval/TimeInterval';

const CreateDaoConfig: React.FC<{
  setActiveStep: React.Dispatch<React.SetStateAction<CreateDaoSteps>>;
}> = ({ setActiveStep }) => {
  const theme = useTheme();
  const { layoutName } = useLayout();
  const spacing = SPACING[layoutName];
  const { defaultDaoConfig: defaultConfig } = networkEnvironment;
  const { config, setConfig } = useCreateDaoContext();
  const {
    delaySelectedIndex,
    delayInputValue,
    resolver,
    customResolver,
    isRuleFile,
    ruleFile,
    ruleText,
  } = config;

  const context: any = useWallet();
  const { provider } = context;

  const methods = useForm<ICreateDaoConfig>();
  const { control, setValue, getValues, trigger, watch } = methods;
  useEffect(() => {
    setValue('ruleText', ruleText);
    setValue('isRuleFile', isRuleFile);
    setValue('ruleFile', ruleFile);
    setValue('customResolver', customResolver);
    setValue('delaySelectedIndex', delaySelectedIndex);
    setValue('delayInputValue', delayInputValue);
  }, [
    ruleText,
    isRuleFile,
    ruleFile,
    resolver,
    customResolver,
    delaySelectedIndex,
    delayInputValue,
    setValue,
  ]);

  const moveToNextStep = async (isBack: boolean) => {
    const validate = await trigger();
    if (!validate && !isBack) return;

    const newConfig = { ...config, ...getValues() };
    setConfig(newConfig);

    if (isBack) {
      setActiveStep(CreateDaoSteps.BasicInfo);
    } else {
      setActiveStep(CreateDaoSteps.Collateral);
    }
  };

  return (
    <Box>
      <div style={{ display: 'grid', gridGap: spacing }}>
        <StepsHeader index={1} />
        <FormProvider {...methods}>
          <TimeInterval
            title="Execution delay"
            subtitle="Amount of time any transaction in your DAO will be available to be disputed by your
          members before being executed."
            placeholder={'Amount'}
            inputName="delayInputValue"
            dropdownName="delaySelectedIndex"
            resultName="executionDelay"
            shouldUnregister={false}
          />

          <IPFSInput
            title="Rules / Agreement"
            subtitle={
              <StyledText name={'title4'} style={{ color: theme.disabledContent }}>
                Your DAO has optimistic capabilities, meaning that transactions can happen without
                voting, but should follow pre defined rules. Please provide the main agreement for
                your DAO (In text, or upload a file). You can use and edit the following text as
                required, or use{' '}
                <Link href="https://docs.google.com/document/d/1HkSiJtjqiTCMbCagn2ev5iv_fG_PpfJcI-NqebmQzng/">
                  this template
                </Link>{' '}
                for a more complete agreement.
              </StyledText>
            }
            shouldUnregister={false}
            placeholder="Please insert your DAO agreement"
            isFile="isRuleFile"
            textInputName="ruleText"
            fileInputName="ruleFile"
            rows={6}
          />
        </FormProvider>

        <div>
          <StyledText name={'title3'}>Dispute resolution client</StyledText>
          <StyledText name={'title4'} style={{ color: theme.disabledContent }}>
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
                    <TextInput
                      wide
                      disabled={!watch('customResolver')}
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
                  <Controller
                    name="customResolver"
                    control={control}
                    defaultValue={customResolver}
                    render={({ field: { onChange, value } }) => (
                      <Checkbox
                        checked={value}
                        onChange={(e: any) => {
                          if (getValues('customResolver')) {
                            // reset resolver
                            setValue('resolver', defaultConfig.resolver);
                          }
                          onChange(e);
                        }}
                      />
                    )}
                  />
                  <span
                    style={{
                      marginLeft: '4px',
                    }}
                  >
                    Override default
                  </span>
                </label>
              </GridItem>
            </Grid>
          </Box>
        </div>

        {watch('customResolver') && (
          <Info mode={'error'} title={''}>
            Carefully review the client address and ensure your chosen client is compatible with
            Govern. An incorrect address or incompatible client may lock your DAO.
          </Info>
        )}

        <Split
          width={'100%'}
          primary={
            <Button
              size={'large'}
              mode={'secondary'}
              onClick={() => moveToNextStep(true)}
              icon={<IconArrowLeft />}
              label={'Back'}
              display={'all'}
            />
          }
          secondary={
            <Button wide size={'large'} mode={'secondary'} onClick={() => moveToNextStep(false)}>
              Next Step
            </Button>
          }
        />
      </div>
    </Box>
  );
};

export default CreateDaoConfig;
