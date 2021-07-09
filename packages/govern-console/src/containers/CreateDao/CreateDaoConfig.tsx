import React, { useEffect } from 'react';
import { CreateDaoSteps } from './utils/Shared';
import { useCreateDaoContext, ICreateDaoConfig } from './utils/CreateDaoContextProvider';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { validateContract } from 'utils/validations';
import { useWallet } from 'AugmentedWallet';
import { IPFSInput } from 'components/Field/IPFSInput';
import { positiveNumber } from 'utils/validations';

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

const CreateDaoConfig: React.FC<{
  setActiveStep: React.Dispatch<React.SetStateAction<CreateDaoSteps>>;
}> = ({ setActiveStep }) => {
  const theme = useTheme();
  const { layoutName } = useLayout();
  const spacing = SPACING[layoutName];
  // const [resolverLock, setResolverLock] = useState(false);
  const { config, setConfig } = useCreateDaoContext();
  const { executionDelay, isRuleFile, ruleFile, ruleText, resolver, customResolver } = config;

  const context: any = useWallet();
  const { provider } = context;

  const methods = useForm<ICreateDaoConfig>();
  const {
    control,
    setValue,
    getValues,
    trigger,
    watch,
    formState: { errors },
  } = methods;

  useEffect(() => {
    setValue('ruleText', ruleText);
    setValue('isRuleFile', isRuleFile);
    setValue('ruleFile', ruleFile);
    setValue('customResolver', customResolver);
  }, [ruleText, isRuleFile, ruleFile, resolver, customResolver, setValue]);

  const moveToNextStep = async () => {
    console.log(errors, ' errors');
    const validate = await trigger();

    if (!validate) return;

    const newConfig = { ...config, ...getValues() };

    setConfig(newConfig);
    setActiveStep(CreateDaoSteps.Collateral);
  };

  return (
    <Box>
      <div style={{ display: 'grid', gridGap: spacing }}>
        <StepsHeader index={1} />

        <Controller
          name="executionDelay"
          control={control}
          defaultValue={executionDelay}
          rules={{
            required: 'This is required.',
            validate: (value) => positiveNumber(value),
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextInput
              title="Execution delay"
              subtitle="Amount of time any action in your DAO will be available to be challenged before being
              executed"
              wide
              value={value}
              placeholder={'Amount'}
              onChange={onChange}
              status={!!error ? 'error' : 'normal'}
              error={error ? error.message : null}
            />
          )}
        />

        <FormProvider {...methods}>
          <IPFSInput
            title="Rules / Agreement"
            subtitle="Your DAO have optimistic capabilities, meaning that actions can happen without voting,
              but should follow pre defined rules. Please provide the main agreement for your DAO (In
              text, or upload a file)."
            shouldUnregister={false}
            placeholder="Please insert the reason why you want to execute this"
            isFile="isRuleFile"
            textInputName="ruleText"
            fileInputName="ruleFile"
          />
        </FormProvider>

        <div>
          <StyledText name={'title3'}>Resolver</StyledText>
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
                  <Checkbox
                    checked={watch('customResolver')}
                    onChange={() => setValue('customResolver', !getValues('customResolver'))}
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

        <Info mode={'warning'} title={''}>
          Hey, this is an important step, please check that all the information entered is correct.
        </Info>

        <Split
          width={'100%'}
          primary={
            <Button
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
            <Button wide size={'large'} mode={'secondary'} onClick={moveToNextStep}>
              Next Step
            </Button>
          }
        />
      </div>
    </Box>
  );
};

export default CreateDaoConfig;
