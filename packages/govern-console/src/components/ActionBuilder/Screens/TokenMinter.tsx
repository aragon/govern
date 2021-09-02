import React, { useCallback } from 'react';
import {
  Button,
  StyledText,
  TextInput,
  ContentSwitcher,
  Grid,
  GridItem,
  useLayout,
  SPACING,
  TextCopy,
} from '@aragon/ui';
import { Hint } from 'components/Hint/Hint';
import { useForm, Controller } from 'react-hook-form';
import { validateAmountForDecimals, validateAddress } from 'utils/validations';
import AbiHandler from 'utils/AbiHandler';
import { useWallet } from 'providers/AugmentedWallet';
import { ActionBuilderCloseHandler } from 'utils/types';
import { useActionBuilderState } from '../ActionBuilderStateProvider';
import { Asset } from 'utils/Asset';
import { constants } from 'ethers';

const functionSignature = 'function mint(address to, uint256 amount, bytes calldata context)';

enum Recipient {
  Executor = 0,
  Other = 1,
}

export interface IMintToken {
  recipient: Recipient;
  recipientAddress: string;
  mintAmount: string;
}

type TokenMinterProps = {
  onClick: ActionBuilderCloseHandler;
};

export const TokenMinter: React.FC<TokenMinterProps> = ({ onClick }) => {
  const { layoutName } = useLayout();
  const spacing = SPACING[layoutName];

  const context: any = useWallet();
  const { provider } = context;
  const { dao } = useActionBuilderState();

  const methods = useForm<IMintToken>();
  const { control, handleSubmit, watch, getValues } = methods;

  const recipient = watch('recipient', 0);

  const submitActionData = useCallback(async () => {
    const { recipientAddress, mintAmount } = getValues();
    const tokenRecipient =
      recipient === Recipient.Executor ? dao?.executor.address : recipientAddress;

    const asset = await Asset.createFromAddress(dao?.token, mintAmount, provider);
    const context = '0x';
    const values = [tokenRecipient, asset.amount, context];

    const action = AbiHandler.mapToAction(functionSignature, dao?.minter, values);
    onClick(action);
  }, [onClick, getValues, dao, provider, recipient]);

  const validateAmount = useCallback(
    async (value: string) => {
      const asset = await Asset.createFromAddress(dao?.token, value, provider);
      return validateAmountForDecimals(value, asset.decimals);
    },
    [provider, dao],
  );

  return (
    <Grid>
      <GridItem>
        <StyledText name="title1">Mint Tokens</StyledText>
        <Hint>Mint more DAO tokens</Hint>
      </GridItem>
      <GridItem>
        <StyledText name="title2">Who should receive minted tokens?</StyledText>
        <Controller
          name="recipient"
          control={control}
          defaultValue={0}
          render={({ field: { onChange, value } }) => (
            <ContentSwitcher
              onChange={onChange}
              selected={value}
              items={['Govern Executor', 'Other address']}
              paddingSettings={{
                horizontal: spacing * 2,
                vertical: spacing / 4,
              }}
            />
          )}
        />
      </GridItem>

      {recipient === Recipient.Executor ? (
        <GridItem>
          <StyledText name="title2">Recipient address</StyledText>
          <Hint>The assets will be transfered to this address.</Hint>
          <TextCopy value={dao?.executor.address} />
        </GridItem>
      ) : (
        <GridItem>
          <Controller
            name="recipientAddress"
            control={control}
            shouldUnregister={true}
            defaultValue=""
            rules={{
              required: 'This is required.',
              validate: validateAddress,
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextInput
                wide
                title="Recipient address"
                subtitle="The assets will be transfered to this address."
                value={value}
                placeholder={constants.AddressZero}
                onChange={onChange}
                status={error ? 'error' : 'normal'}
                error={error ? error.message : null}
              />
            )}
          />
        </GridItem>
      )}

      <GridItem>
        <Controller
          name="mintAmount"
          control={control}
          defaultValue=""
          rules={{
            required: 'This is required.',
            validate: validateAmount,
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextInput
              wide
              title="Amount"
              subtitle="Number of tokens to mint."
              value={value}
              placeholder="0"
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
          size="large"
          label="Add transaction"
          onClick={handleSubmit(submitActionData)}
        ></Button>
      </GridItem>
    </Grid>
  );
};
