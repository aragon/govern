import React, { useCallback } from 'react';
import { Grid, GridItem, DropDown, Button, TextInput, StyledText, useTheme } from '@aragon/ui';
import { ActionBuilderCloseHandler } from 'utils/types';
import { Hint } from 'components/Hint/Hint';
import { useForm, Controller } from 'react-hook-form';
import { validateAmountForDecimals, validateToken } from 'utils/validations';
import { useWallet } from 'AugmentedWallet';
import AbiHandler from 'utils/AbiHandler';
import { Asset, OTHER_TOKEN_SYMBOL } from 'utils/Asset';

import { networkEnvironment } from 'environment';
const { curatedTokens } = networkEnvironment;
const withdrawalAssets = Object.keys(curatedTokens).concat([OTHER_TOKEN_SYMBOL]);

const transferSignature = 'function transfer(address destination, uint amount)';

type AssetWithdrawalProps = {
  onClick: ActionBuilderCloseHandler;
};

type WithdrawalFormData = {
  recipient: string;
  token: number;
  tokenContractAddress: string;
  withdrawalAmount: string;
};

export const AssetWithdrawal: React.FC<AssetWithdrawalProps> = ({ onClick }) => {
  const theme = useTheme();
  const context: any = useWallet();
  const { provider } = context;

  const methods = useForm<WithdrawalFormData>();
  const { control, handleSubmit, watch, getValues } = methods;
  const selectedToken = watch('token', 0);

  const buildActions = useCallback(async () => {
    const { token, recipient, tokenContractAddress, withdrawalAmount } = getValues();

    const asset = await Asset.createFromSymbol(
      withdrawalAssets[token],
      tokenContractAddress,
      withdrawalAmount,
      provider,
    );
    const values = [recipient, asset.amount];

    const action = AbiHandler.mapToAction(transferSignature, asset.address, values);

    onClick(action);
  }, [onClick, getValues, provider]);

  const validateAmount = useCallback(
    async (value: string) => {
      const { token, tokenContractAddress } = getValues();
      const asset = await Asset.createFromSymbol(
        withdrawalAssets[token],
        tokenContractAddress,
        value,
        provider,
      );
      return validateAmountForDecimals(value, asset.decimals);
    },
    [provider, getValues],
  );

  return (
    <Grid>
      <GridItem>
        <StyledText name="title1">Withdraw assets</StyledText>
        <Hint>Helptext TBD</Hint>
      </GridItem>
      <GridItem>
        <Controller
          name="recipient"
          control={control}
          defaultValue=""
          rules={{
            required: 'This is required.',
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextInput
              wide
              title="Recipient address"
              subtitle="The assets will be transfered to this address."
              value={value}
              placeholder="Type recipent address"
              onChange={onChange}
              status={error ? 'error' : 'normal'}
              error={error ? error.message : null}
            />
          )}
        />
      </GridItem>
      <GridItem>
        <StyledText name="title2">Token</StyledText>
        <Hint>Choose which token you would like to withdraw.</Hint>
        <Controller
          name="token"
          control={control}
          defaultValue={0}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <div>
              <DropDown wide items={withdrawalAssets} selected={value} onChange={onChange} />
              {error ? <div style={{ color: `${theme.red}` }}>{error.message}</div> : null}
            </div>
          )}
        />
      </GridItem>
      {Asset.isOtherToken(withdrawalAssets[selectedToken]) && (
        <GridItem>
          <Controller
            name="tokenContractAddress"
            control={control}
            defaultValue=""
            shouldUnregister={true}
            rules={{
              required: 'This is required.',
              validate: (value) => validateToken(value, provider),
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextInput
                wide
                title="Token contract address"
                subtitle="Insert contract address of token to be withdrawn."
                value={value}
                placeholder="Type contract address"
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
          name="withdrawalAmount"
          control={control}
          defaultValue=""
          rules={{
            required: 'This is required.',
            validate: validateAmount,
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextInput
              wide
              type="number"
              title="Amount"
              subtitle="Define how many tokens you want to withdraw."
              value={value}
              placeholder={0}
              onChange={onChange}
              status={error ? 'error' : 'normal'}
              error={error ? error.message : null}
            />
          )}
        />
      </GridItem>
      <GridItem>
        <Button
          size="large"
          mode="primary"
          label="Save action now"
          onClick={handleSubmit(buildActions)}
        ></Button>
      </GridItem>
    </Grid>
  );
};
