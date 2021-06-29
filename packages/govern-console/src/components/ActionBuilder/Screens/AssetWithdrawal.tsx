import React, { useCallback } from 'react';
import { Grid, GridItem, DropDown, Button, TextInput, StyledText, useTheme } from '@aragon/ui';
import { ActionBuilderCloseHandler } from 'utils/types';
import { Hint } from 'components/Hint/Hint';
import { useForm, Controller } from 'react-hook-form';
import { validateAmountForToken, validateToken } from 'utils/validations';
import { useWallet } from 'AugmentedWallet';
import AbiHandler from 'utils/AbiHandler';
import { utils } from 'ethers';
import { getToken } from '@aragon/govern';
import { networkEnvironment } from 'environment';
const { withdrawalTokens } = networkEnvironment;

const TOKEN_SYMBOLS = Object.keys(withdrawalTokens).concat('Other...');
const TOKEN_ADDRESSES = Object.values(withdrawalTokens);

const transferSignature = 'function transfer(address destination, uint amount)';

type AssetWithdrawalProps = {
  onClick: ActionBuilderCloseHandler;
};

type WithdrawalFormData = {
  recipient: string;
  token: number;
  tokenContractAddress: string;
  withdrawalAmount: number;
};

const isOtherToken = (tokenIndex: number) => tokenIndex === TOKEN_ADDRESSES.length;

export const AssetWithdrawal: React.FC<AssetWithdrawalProps> = ({ onClick }) => {
  const theme = useTheme();
  const context: any = useWallet();
  const { provider } = context;

  const methods = useForm<WithdrawalFormData>();
  const { control, handleSubmit, watch, getValues } = methods;
  const selectedToken = watch('token', 0);

  const buildActions = useCallback(async () => {
    const { token, recipient, tokenContractAddress, withdrawalAmount } = getValues();

    const contractAddress = isOtherToken(token) ? tokenContractAddress : TOKEN_ADDRESSES[token];

    let decimals = 0;
    try {
      const { tokenDecimals } = await getToken(contractAddress, provider);
      decimals = tokenDecimals || 0;
    } catch (err) {
      console.log('failed to get token info', contractAddress, err.message);
    }

    const amount = utils.parseUnits(String(withdrawalAmount), decimals);
    const values = [recipient, amount];

    const action = AbiHandler.mapToAction(transferSignature, contractAddress, values);

    onClick(action);
  }, [onClick, getValues, provider]);

  const validateAmount = useCallback(
    (value: string) => {
      const { token, tokenContractAddress } = getValues();
      const contractAddress = isOtherToken(token) ? tokenContractAddress : TOKEN_ADDRESSES[token];
      return validateAmountForToken(contractAddress, value, provider);
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
              <DropDown wide items={TOKEN_SYMBOLS} selected={value} onChange={onChange} />
              {error ? <div style={{ color: `${theme.red}` }}>{error.message}</div> : null}
            </div>
          )}
        />
      </GridItem>
      {isOtherToken(selectedToken) && (
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
