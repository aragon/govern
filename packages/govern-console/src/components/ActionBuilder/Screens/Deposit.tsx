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
import { ActionBuilderCloseHandler } from 'utils/types';
import { Hint } from 'components/Hint/Hint';
import { useForm, Controller } from 'react-hook-form';
import { validateAmountForToken, validateToken } from 'utils/validations';
import { useWallet } from 'AugmentedWallet';
import { Contract, utils } from 'ethers';
import { getToken } from '@aragon/govern';
import { useActionBuilderState } from '../ActionBuilderStateProvider';
import { getTruncatedAccountAddress } from 'utils/account';

import { networkEnvironment } from 'environment';
const { withdrawalTokens } = networkEnvironment;

const TOKEN_SYMBOLS = Object.keys(withdrawalTokens).concat('Other...');
const TOKEN_ADDRESSES = Object.values(withdrawalTokens);

const transferAbi = ['function transfer(address destination, uint amount)'];

type DepositProps = {
  onClick: ActionBuilderCloseHandler;
};

type DepositFormData = {
  token: number;
  tokenContractAddress: string;
  depositAmount: number;
};

const isOtherToken = (tokenIndex: number) => tokenIndex === TOKEN_ADDRESSES.length;

export const Deposit: React.FC<DepositProps> = ({ onClick }) => {
  const theme = useTheme();
  const { layoutName } = useLayout();
  const spacing = SPACING[layoutName];

  const context: any = useWallet();
  const { provider, account, networkName } = context;

  const methods = useForm<DepositFormData>();
  const { control, handleSubmit, watch, getValues } = methods;
  const selectedToken = watch('token', 0);

  const { dao } = useActionBuilderState();

  const buildActions = useCallback(async () => {
    const { token, tokenContractAddress, depositAmount } = getValues();

    try {
      const contractAddress = isOtherToken(token) ? tokenContractAddress : TOKEN_ADDRESSES[token];
      const { tokenDecimals } = await getToken(contractAddress, provider);
      const amount = utils.parseUnits(String(depositAmount), tokenDecimals);
      const contract = new Contract(contractAddress, transferAbi, account.signer);
      const tx = await contract.transfer(account?.address, amount);
      await tx.wait();
      onClick();
    } catch (err) {
      console.log('deposit error', err);
    }
  }, [onClick, getValues, provider, account]);

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
            label={getTruncatedAccountAddress(account?.address)}
          ></Button>
          <Tag background={theme.green} mode="activity" size="normal">
            <h1 style={{ margin: spacing }}>{networkName}</h1>
          </Tag>
        </div>
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
          label="Save action now"
          onClick={handleSubmit(buildActions)}
        ></Button>
      </GridItem>
    </Grid>
  );
};
