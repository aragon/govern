import React, { useCallback, useState } from 'react';
import {
  StyledText,
  Button,
  TextInput,
  useTheme,
  useLayout,
  SPACING,
  IconWarning,
} from '@aragon/ui';
import { Controller, useForm } from 'react-hook-form';
import { validateContract, validateAbi } from 'utils/validations';
import { useWallet } from 'AugmentedWallet';
import { useActionBuilderState } from '../ActionBuilderStateProvider';
import { utils } from 'ethers';
import AbiHandler from 'utils/AbiHandler';
import { ActionBuilderContent } from '../ActionBuilderContent';

type FormInput = {
  contractAddress: string;
  abi: string;
};

export const AbiForm: React.FC = () => {
  const context: any = useWallet();
  const { provider, networkName } = context;
  const { layoutName } = useLayout();
  const spacing = SPACING[layoutName];
  const theme = useTheme();

  const methods = useForm<FormInput>();
  const { control, handleSubmit, getValues, setValue } = methods;

  const { contractAddress, gotoFunctionSelector } = useActionBuilderState();
  const [warning, setWarning] = useState(false);

  const gotoNextScreen = useCallback(() => {
    const formData = getValues();
    gotoFunctionSelector(formData.contractAddress, formData.abi);
  }, [getValues, gotoFunctionSelector]);

  const fetchAbi = useCallback(async () => {
    const address =
      contractAddress && utils.isAddress(contractAddress)
        ? contractAddress
        : await provider.resolveName(contractAddress);

    const abiHandler = new AbiHandler(networkName);
    const abi = await abiHandler.get(address);
    if (abi) {
      setValue('abi', abi);
    } else {
      setWarning(true);
    }
  }, [networkName, contractAddress, provider, setValue, setWarning]);

  return (
    <ActionBuilderContent>
      <StyledText name="title1">Choose contract</StyledText>
      <section>
        <StyledText name="title2">Input contract address</StyledText>
        <div
          css={`
            display: grid;
            grid-template-columns: auto 0.2fr;
            column-gap: ${spacing}px;
            align-items: center;
          `}
        >
          <Controller
            name="contractAddress"
            control={control}
            shouldUnregister={true}
            defaultValue={contractAddress}
            rules={{
              required: 'This is required.',
              validate: async (value) => validateContract(value, provider),
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
          <Button label="Search" onClick={fetchAbi}></Button>
        </div>
        <div
          style={{
            opacity: `${warning ? 1 : 0}`,
            color: `${theme.warning}`,
            display: 'grid',
            gridTemplateColumns: '30px 1fr',
          }}
        >
          <IconWarning />
          <div>Contract not verified, you need insert the input function ABI</div>
        </div>
      </section>
      <section>
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
              title="Input function ABI"
              value={value}
              placeholder="Function ABI"
              onChange={onChange}
              status={error ? 'error' : 'normal'}
              error={error ? error.message : null}
            />
          )}
        />
      </section>
      <section>
        <Button
          mode={'primary'}
          wide
          label="Choose"
          onClick={handleSubmit(gotoNextScreen)}
        ></Button>
      </section>
    </ActionBuilderContent>
  );
};
