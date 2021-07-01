import React, { useCallback, useState } from 'react';
import {
  StyledText,
  Button,
  TextInput,
  useTheme,
  IconWarning,
  Grid,
  GridItem,
  Help,
  useLayout,
  SPACING,
} from '@aragon/ui';
import { Controller, useForm } from 'react-hook-form';
import { validateContract, validateAbi } from 'utils/validations';
import { useWallet } from 'AugmentedWallet';
import { useActionBuilderState } from '../ActionBuilderStateProvider';
import AbiHandler from 'utils/AbiHandler';

type FormInput = {
  contractAddress: string;
  abi: string;
};

export const AbiForm: React.FC = () => {
  const context: any = useWallet();
  const { provider, networkName } = context;

  const theme = useTheme();
  const { layoutName } = useLayout();
  const spacing = SPACING[layoutName];

  const methods = useForm<FormInput>();
  const { control, handleSubmit, trigger, getValues } = methods;

  const { gotoFunctionSelector } = useActionBuilderState();
  const [warning, setWarning] = useState(false);

  const gotoNextScreen = useCallback(() => {
    const formData = getValues();
    gotoFunctionSelector(formData.contractAddress, formData.abi);
  }, [getValues, gotoFunctionSelector]);

  const fetchAbi = useCallback(async () => {
    const validationResult = await trigger('contractAddress');
    if (validationResult === false) {
      // address is invalid
      return;
    }

    const address = getValues('contractAddress');
    const abiHandler = new AbiHandler(networkName);
    const abi = await abiHandler.get(address);
    if (abi) {
      gotoFunctionSelector(address, abi);
    } else {
      setWarning(true);
    }
  }, [networkName, trigger, getValues, gotoFunctionSelector, setWarning]);

  return (
    <Grid>
      <GridItem>
        <StyledText name="title1">Choose contract</StyledText>
      </GridItem>
      <GridItem>
        <StyledText name="title2">Input contract address</StyledText>
        <Grid columns="4" columnWidth="1fr" alignVertical="center">
          <GridItem gridColumn="1/4">
            <Controller
              name="contractAddress"
              control={control}
              shouldUnregister={true}
              defaultValue=""
              rules={{
                required: 'This is required.',
                validate: async (value) => await validateContract(value, provider),
              }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextInput
                  wide
                  value={value}
                  placeholder="Type contract address"
                  onChange={onChange}
                  status={error ? 'error' : 'normal'}
                  error={error ? error.message : null}
                />
              )}
            />
          </GridItem>
          <GridItem gridColum="4/5" alignVertical="center">
            <Button label="Search" onClick={fetchAbi}></Button>
          </GridItem>
        </Grid>
        <div
          style={{
            opacity: `${warning ? 1 : 0}`,
            color: `${theme.warning}`,
            display: 'grid',
            gridTemplateColumns: '30px 1fr',
          }}
        >
          <IconWarning />
          <div>Contract not verified, please insert the input function ABI</div>
        </div>
      </GridItem>
      <GridItem>
        <StyledText name="title2">
          <div style={{ display: 'flex', columnGap: `${spacing}px`, alignItems: 'center' }}>
            <div>Input function ABI </div>
            <div>
              <Help hint="What is an ABI?">
                An ABI is the specification used to interact with Ethereum smart contracts
              </Help>
            </div>
          </div>
        </StyledText>
        <Controller
          name="abi"
          control={control}
          shouldUnregister={true}
          defaultValue=""
          rules={{
            required: 'This is required.',
            validate: async (value) => validateAbi(value),
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextInput
              wide
              style={{ minHeight: '200px' }}
              multiline
              value={value}
              placeholder="Function ABI"
              onChange={onChange}
              status={error ? 'error' : 'normal'}
              error={error ? error.message : null}
            />
          )}
        />
      </GridItem>
      <GridItem>
        <Button
          mode={'primary'}
          wide
          label="Choose"
          onClick={handleSubmit(gotoNextScreen)}
        ></Button>
      </GridItem>
    </Grid>
  );
};
