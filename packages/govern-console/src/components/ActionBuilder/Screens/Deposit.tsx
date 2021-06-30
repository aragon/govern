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
} from '@aragon/ui';
import { Hint } from 'components/Hint/Hint';
import { useForm, Controller } from 'react-hook-form';
import { validateAmountForToken, validateToken } from 'utils/validations';
import { useWallet } from 'AugmentedWallet';
import { Contract, utils } from 'ethers';
import { getToken } from '@aragon/govern';
import { useActionBuilderState } from '../ActionBuilderStateProvider';
import { getTruncatedAccountAddress } from 'utils/account';
import { CuratedTokens } from 'utils/CuratedTokens';
import { useSnackbar } from 'notistack';
import { getErrorFromException } from 'utils/HelperFunctions';
import { CustomTransaction, CustomTransactionStatus } from 'utils/types';

const curatedTokens = new CuratedTokens();

const transferAbi = ['function transfer(address destination, uint amount)'];

type DepositFormData = {
  token: number;
  tokenContractAddress: string;
  depositAmount: number;
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
  const { enqueueSnackbar } = useSnackbar();

  const buildActions = useCallback(async () => {
    const { token, tokenContractAddress, depositAmount } = getValues();

    try {
      const contractAddress = curatedTokens.getTokenAddress(token, tokenContractAddress);
      const { tokenDecimals } = await getToken(contractAddress, provider);
      const amount = utils.parseUnits(String(depositAmount), tokenDecimals);
      const contract = new Contract(contractAddress, transferAbi, account.signer);
      const tx: CustomTransaction = {
        tx: () => contract.transfer(account?.address, amount),
        message: 'Deposit asset',
        status: CustomTransactionStatus.Pending,
      };

      gotoProcessTransaction([tx]);
    } catch (err) {
      console.log('deposit error', err);
      const errorMessage = getErrorFromException(err);
      enqueueSnackbar(errorMessage, {
        variant: 'error',
      });
    }
  }, [getValues, provider, account, enqueueSnackbar, gotoProcessTransaction]);

  const validateAmount = useCallback(
    (value: string) => {
      const { token, tokenContractAddress } = getValues();
      const contractAddress = curatedTokens.getTokenAddress(token, tokenContractAddress);
      return validateAmountForToken(contractAddress, value, provider);
    },
    [provider, getValues],
  );

  return (
    <Grid>
      <GridItem>
        <StyledText name="title1">Deposit assets</StyledText>
        <Hint>
          This will create a request on your wallet to transfer the amount of tokens to the govern
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
        <StyledText name="title2">Token</StyledText>
        <Hint>Choose which token you would like to deposit.</Hint>
        <Controller
          name="token"
          control={control}
          defaultValue={0}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <div>
              <DropDown
                wide
                items={curatedTokens.getTokenSymbols()}
                selected={value}
                onChange={onChange}
              />
              {error ? <div style={{ color: `${theme.red}` }}>{error.message}</div> : null}
            </div>
          )}
        />
      </GridItem>
      {curatedTokens.isCustomToken(selectedToken) && (
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
              title="Amount"
              subtitle="Define how many tokens you want to deposit."
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
          label="Deposit assets now"
          onClick={handleSubmit(buildActions)}
        ></Button>
      </GridItem>
    </Grid>
  );
};
