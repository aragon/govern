import React, { useCallback } from 'react';
import {
  Button,
  StyledText,
  TextInput,
  ContentSwitcher,
  useLayout,
  SPACING,
  TextCopy,
} from '@aragon/ui';
import { Hint } from 'components/Hint/Hint';
import { useForm, Controller } from 'react-hook-form';
import { validateAmountForToken, validateToken } from 'utils/validations';
import AbiHandler from 'utils/AbiHandler';
import { useWallet } from 'AugmentedWallet';
import { utils } from 'ethers';
import { getToken } from '@aragon/govern';
import { ActionBuilderCloseHandler } from 'utils/types';
import { useActionBuilderState } from '../ActionBuilderStateProvider';

const functionSignature = 'mint(address recipient, uint amount)';

enum Recipient {
  Executor = 0,
  Other = 1,
}

export interface IMintToken {
  recipient: Recipient;
  tokenAddress: string;
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
    const formValues = getValues();
    const tokenRecipient =
      formValues.recipient === Recipient.Executor ? dao?.executor.address : formValues.tokenAddress;

    const { tokenDecimals } = await getToken(dao?.token, provider);
    const amount = utils.parseUnits(formValues.mintAmount, tokenDecimals);
    const values = [tokenRecipient, amount];

    const action = AbiHandler.mapToAction(functionSignature, dao?.token, values);
    onClick(action);
  }, [onClick, getValues, dao, provider]);

  return (
    <div
      css={`
        display: grid;
        row-gap: ${spacing}px;
      `}
    >
      <section>
        <StyledText name="title1">Mint Tokens</StyledText>
        <Hint>Helptext TBD</Hint>
      </section>
      <section>
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
      </section>

      {recipient === Recipient.Executor ? (
        <section>
          <StyledText name="title2">Recipient address</StyledText>
          <Hint>The assets will be transfered to this address.</Hint>
          <TextCopy value={dao?.executor.address} />
        </section>
      ) : (
        <section>
          <Controller
            name="tokenAddress"
            control={control}
            shouldUnregister={true}
            defaultValue=""
            rules={{
              required: 'This is required.',
              validate: (value) => validateToken(value, provider),
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
        </section>
      )}

      <section>
        <Controller
          name="mintAmount"
          control={control}
          defaultValue=""
          rules={{
            required: 'This is required.',
            validate: (value) => validateAmountForToken(dao?.token, value, provider),
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextInput
              wide
              title="Amount"
              subtitle="Define how many tokens you want to mint."
              value={value}
              placeholder="0"
              onChange={onChange}
              status={error ? 'error' : 'normal'}
              error={error ? error.message : null}
            />
          )}
        />
      </section>
      <Button
        mode={'primary'}
        label="Save action now"
        onClick={handleSubmit(submitActionData)}
      ></Button>
    </div>
  );
};
