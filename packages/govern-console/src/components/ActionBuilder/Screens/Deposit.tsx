import React, { useCallback } from 'react';
import {
  EthIdenticon,
  RADIUS,
  Tag,
  Grid,
  GridItem,
  DropDown,
  Button,
  TextInput,
  StyledText,
  useTheme,
  useLayout,
  SPACING,
  useToast,
} from '@aragon/ui';
import { Hint } from 'components/Hint/Hint';
import { useForm, Controller } from 'react-hook-form';
import { validateAmountForDecimals, validateToken, validateBalance } from 'utils/validations';
import { useWallet } from 'AugmentedWallet';
import { useActionBuilderState } from '../ActionBuilderStateProvider';
import { getTruncatedAccountAddress } from 'utils/account';
import { getErrorFromException } from 'utils/HelperFunctions';
import { Executor } from 'services/Executor';
import { Asset, AssetLabel, ETH, OTHER_TOKEN_SYMBOL } from 'utils/Asset';
import { networkEnvironment } from 'environment';
const { curatedTokens } = networkEnvironment;

const depositAssets = Object.keys(curatedTokens).concat([
  ETH.symbol,
  OTHER_TOKEN_SYMBOL,
]) as Array<AssetLabel>;

type DepositFormData = {
  token: number;
  tokenContractAddress: string;
  depositAmount: string;
  reference?: string;
};

export const Deposit: React.FC = () => {
  const theme = useTheme();
  const { layoutName } = useLayout();
  const spacing = SPACING[layoutName];

  const context: any = useWallet();
  const { provider, account, networkName } = context;

  const methods = useForm<DepositFormData>();
  const { control, handleSubmit, watch, getValues } = methods;
  const selectedToken = watch('token', 0);

  const { dao, gotoProcessTransaction } = useActionBuilderState();
  const toast = useToast();

  const buildActions = useCallback(async () => {
    const { token, tokenContractAddress, depositAmount, reference = '' } = getValues();

    try {
      const executor = new Executor(dao.executor.address, account.signer);
      const asset = await Asset.createFromDropdownLabel(
        depositAssets[token],
        tokenContractAddress,
        depositAmount,
        provider,
      );
      const transactions = await executor.deposit(asset, reference);
      gotoProcessTransaction(transactions);
    } catch (err) {
      console.log('deposit error', err);
      const errorMessage = getErrorFromException(err);
      toast(errorMessage);
    }
  }, [getValues, account, dao, provider, toast, gotoProcessTransaction]);

  const validateAmount = useCallback(
    async (value: string) => {
      const { token: selectedIndex, tokenContractAddress } = getValues();
      try {
        const asset = await Asset.createFromDropdownLabel(
          depositAssets[selectedIndex],
          tokenContractAddress,
          value,
          provider,
        );

        const result = validateAmountForDecimals(value, asset.decimals);
        if (result !== true) {
          return result;
        }

        const owner = await account?.signer?.getAddress();
        return validateBalance(asset, owner, provider);
      } catch (err) {
        console.log('Error validating amount', err);
        return 'Error validating amount';
      }
    },
    [provider, getValues, account],
  );

  return (
    <Grid>
      <GridItem>
        <StyledText name="title1">Deposit assets</StyledText>
        <Hint>
          This will create a request on your wallet to transfer the amount of assets to the govern
          executor address ({dao?.executor.address})
        </Hint>
      </GridItem>
      <GridItem>
        <StyledText name="title2">Wallet</StyledText>
        <div
          style={{
            display: 'flex',
            columnGap: `${spacing}px`,
            flexFlow: 'row nowrap',
            justifyContent: 'start',
            alignItems: 'center',
          }}
        >
          <Button
            css={`
              color: ${theme.black};
            `}
            size="large"
            mode="secondary"
            icon={
              <EthIdenticon
                address={account?.address || 'Not Connected'}
                radius={RADIUS}
                css={`
                  display: block;
                `}
              />
            }
            label={getTruncatedAccountAddress(account?.address || 'not-connected')}
          ></Button>
          <Tag background={`${theme.green}`} mode="activity" size="normal">
            <h1 style={{ margin: spacing }}>{networkName}</h1>
          </Tag>
        </div>
      </GridItem>
      <GridItem>
        <StyledText name="title2">Asset</StyledText>
        <Hint>Choose which asset you would like to deposit.</Hint>
        <Controller
          name="token"
          control={control}
          defaultValue={0}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <div>
              <DropDown wide items={depositAssets} selected={value} onChange={onChange} />
              {error ? <div style={{ color: `${theme.red}` }}>{error.message}</div> : null}
            </div>
          )}
        />
      </GridItem>
      {Asset.isOtherToken(depositAssets[selectedToken]) && (
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
                subtitle="Insert contract address of token to be deposited."
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
          name="depositAmount"
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
              min="1"
              title="Amount"
              subtitle="Define the amount of assets you want to deposit."
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
          label="Deposit assets now"
          onClick={handleSubmit(buildActions)}
        ></Button>
      </GridItem>
    </Grid>
  );
};
