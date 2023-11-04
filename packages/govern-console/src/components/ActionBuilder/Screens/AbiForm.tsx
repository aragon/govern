import React, { useCallback, useState } from 'react';
import {
  StyledText,
  Button,
  TextInput,
  IconWarning,
  Grid,
  GridItem,
  Help,
  useTheme,
  useLayout,
  SPACING,
  Info,
} from '@aragon/ui';
import { Controller, useForm } from 'react-hook-form';
import { validateContract, validateAbi } from 'utils/validations';
import { useWallet } from 'providers/AugmentedWallet';
import { useActionBuilderState } from '../ActionBuilderStateProvider';
import AbiHandler from 'utils/AbiHandler';
import { constants } from 'ethers';

type FormInput = {
  contractAddress: string;
  implementationAddress: string;
  abi: string;
};

export const AbiForm: React.FC = () => {
  const context: any = useWallet();
  const { provider, networkName } = context;

  const theme = useTheme();
  const { layoutName } = useLayout();
  const spacing = SPACING[layoutName];
  const compact = layoutName === 'small';

  const methods = useForm<FormInput>();
  const { control, handleSubmit, trigger, getValues, formState } = methods;

  const { gotoFunctionSelector } = useActionBuilderState();
  const [showAbi, setShowAbi] = useState(false);

  const gotoNextScreen = useCallback(() => {
    const formData = getValues();
    gotoFunctionSelector(formData.contractAddress, formData.abi);
  }, [getValues, gotoFunctionSelector]);

  const fetchAbi = useCallback(async () => {
    const validationResult =
      (await trigger('contractAddress')) && (await trigger('implementationAddress'));
    if (validationResult === false) {
      // address is invalid
      return;
    }

    const address = getValues('contractAddress');
    const implementationAddress = getValues('implementationAddress');
    const abiHandler = new AbiHandler(networkName);
    const abi = await abiHandler.get(implementationAddress || address);
    if (abi) {
      gotoFunctionSelector(address, abi);
    } else {
      setShowAbi(true);
    }
  }, [networkName, trigger, getValues, gotoFunctionSelector, setShowAbi]);

  return (
    <Grid>
      <GridItem>
        <StyledText name="title1">Contract address</StyledText>
      </GridItem>
      <GridItem>
        <StyledText name="title2">Input contract address</StyledText>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            alignContent: 'stretch',
            columnGap: `${spacing}px`,
            rowGap: `${spacing}px`,
            flexFlow: 'row wrap',
          }}
        >
          <div style={{ flex: '1', minWidth: '400px' }}>
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
                  placeholder={constants.AddressZero}
                  onChange={onChange}
                  status={error ? 'error' : 'normal'}
                  error={error ? error.message : null}
                />
              )}
            />
          </div>
          <div style={{ flex: '1', minWidth: '400px' }}>
            <StyledText name="title3">Implementation address (optional)</StyledText>
            <Controller
              name="implementationAddress"
              control={control}
              shouldUnregister={true}
              defaultValue=""
              rules={{
                validate: async (value) => !value || (await validateContract(value, provider)),
              }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextInput
                  wide
                  value={value}
                  placeholder={constants.AddressZero}
                  onChange={onChange}
                  status={error ? 'error' : 'normal'}
                  error={error ? error.message : null}
                />
              )}
            />
          </div>
          <div style={{ flex: '1', minWidth: '400px' }}>
            <Button wide label="Search" onClick={fetchAbi}></Button>
            {!compact && formState.errors.contractAddress && (
              <div style={{ opacity: 0 }}>filler</div>
            )}
          </div>
        </div>
      </GridItem>
      {showAbi && (
        <Grid>
          <GridItem>
            <Info mode="warning" borderColor={`${theme.warningSurface}`}>
              <div style={{ display: 'flex', alignItems: 'center', columnGap: '5px' }}>
                <IconWarning></IconWarning>
                <span>Contract not verified, please insert the input function ABI</span>
              </div>
            </Info>
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
              label="Select"
              onClick={handleSubmit(gotoNextScreen)}
            ></Button>
          </GridItem>
        </Grid>
      )}
    </Grid>
  );
};
