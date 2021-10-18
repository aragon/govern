import React, { useCallback } from 'react';
import {
  Grid,
  GridItem,
  DropDown,
  Button,
  TextInput,
  StyledText,
  useTheme,
  Tag,
  SPACING,
  useLayout,
  useToast,
} from '@aragon/ui';
import { ActionBuilderCloseHandler } from 'utils/types';
import { Hint } from 'components/Hint/Hint';
import { useForm, Controller } from 'react-hook-form';
import { validateAmountForDecimals, validateToken } from 'utils/validations';
import { useWallet } from 'providers/AugmentedWallet';
import AbiHandler from 'utils/AbiHandler';
import { Asset, AssetLabel, ETH, OTHER_TOKEN_SYMBOL } from 'utils/Asset';
import { useActionBuilderState } from '../ActionBuilderStateProvider';
import { getErrorFromException } from 'utils/HelperFunctions';
import { networkEnvironment } from 'environment';
import { constants } from 'ethers';

const { curatedTokens } = networkEnvironment;
const withdrawalAssets = Object.keys(curatedTokens).concat([
  ETH.symbol,
  OTHER_TOKEN_SYMBOL,
]) as Array<AssetLabel>;

const withdrawSignature =
  'function withdraw(address token, address from, address to, uint256 amount, string memory reference)';

type AssetWithdrawalProps = {
  onClick: ActionBuilderCloseHandler;
};

type WithdrawalFormData = {
  recipient: string;
  token: number;
  tokenContractAddress: string;
  withdrawalAmount: string;
  reference?: string;
};

export const AssetWithdrawal: React.FC<AssetWithdrawalProps> = ({ onClick }) => {
  const theme = useTheme();
  const { layoutName } = useLayout();
  const spacing = SPACING[layoutName];

  const context: any = useWallet();
  const { provider } = context;

  const { dao } = useActionBuilderState();
  const toast = useToast();

  const methods = useForm<WithdrawalFormData>();
  const { control, handleSubmit, watch, getValues } = methods;
  const selectedToken = watch('token', 0);

  // build the action data to be scheduled
  const buildActions = useCallback(async () => {
    const {
      token,
      recipient,
      tokenContractAddress,
      withdrawalAmount,
      reference = '',
    } = getValues();

    try {
      const asset = await Asset.createFromDropdownLabel(
        withdrawalAssets[token],
        tokenContractAddress,
        withdrawalAmount,
        provider,
      );

      const executor = dao?.executor.address;
      const values = [asset.address, executor, recipient, asset.amount, reference];
      const action = AbiHandler.mapToAction(withdrawSignature, executor, values);

      onClick(action);
    } catch (err) {
      console.log('withdrawal error', err);
      const errorMessage = getErrorFromException(err);
      toast(errorMessage);
    }
  }, [onClick, getValues, toast, dao, provider]);

  const validateAmount = useCallback(
    async (value: string) => {
      try {
        const { token, tokenContractAddress } = getValues();
        const asset = await Asset.createFromDropdownLabel(
          withdrawalAssets[token],
          tokenContractAddress,
          value,
          provider,
        );
        return validateAmountForDecimals(value, asset.decimals);
      } catch (err) {
        console.log('Error validiting amount', value, err);
        return 'Error validiting amount';
      }
    },
    [provider, getValues],
  );

  return (
    <Grid>
      <GridItem>
        <StyledText name="title1">Send funds</StyledText>
        <Hint>Transfer DAO funds to any address.</Hint>
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
              placeholder={constants.AddressZero}
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
              subtitle="Number of tokens to transfer."
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
        <StyledText name="title2">
          <span style={{ marginRight: `${spacing}px` }}>Reference</span>
          <Tag
            color={`${theme.black}`}
            uppercase={false}
            mode="indicator"
            size="normal"
            label="Optional"
          ></Tag>
        </StyledText>
        <Controller
          name="reference"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextInput
              wide
              multiline
              value={value}
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
          label="Add transaction"
          onClick={handleSubmit(buildActions)}
        ></Button>
      </GridItem>
    </Grid>
  );
};
