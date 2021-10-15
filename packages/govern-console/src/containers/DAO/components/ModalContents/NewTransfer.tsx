import styled from 'styled-components';
import { useCallback } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { DropDown, GU, TextInput, Button, IconDownload } from '@aragon/ui';

import { Asset } from 'utils/Asset';
import { useWallet } from 'providers/AugmentedWallet';
import { useTransferContext } from './TransferContext';
import { validateAmountForDecimals, validateBalance, validateToken } from 'utils/validations';
import { ContentSwitcher } from 'components/ContentSwitcher/ContentSwitcher';
import { NewIPFSInput } from 'components/Field/NewIPFSInput';

const HeaderContainer = styled.div`
  display: flex;
  padding-bottom: 26px;
`;

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 520px;
  ::-webkit-scrollbar-track {
    background: #f6f9fc;
  }
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-thumb {
    background: #eff1f7;
    border-radius: 12px;
  }
`;

const Title = styled.p`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
`;

const SubTitle = styled.p`
  font-weight: 600;
  font-size: 16px;
  line-height: 125%;
`;

const Description = styled.p`
  color: #7483ab;
  font-weight: 500;
  font-size: 16px;
  line-height: 150%;
  padding-top: 4px;
`;

const InputContainer = styled.div`
  margin-top: ${GU}px;
  margin-bottom: ${3 * GU}px;
`;

const TextAreaContainer = styled.div`
  margin-top: ${GU}px;
  margin-bottom: ${3 * GU}px;
`;

const StyledTextInput = styled(TextInput)`
  border-radius: 12px;
`;

const SubmitButton = styled(Button)`
  min-height: 48px;
  width: 100%;
  box-shadow: none;

  & p {
    font-weight: 600;
    font-size: 16px;
    margin-right: 12px;
  }
`;

const SelectedToken = styled.div`
  display: flex;
  align-items: center;
  height: 24px;
  gap: 12px;
  color: #20232c;

  & > img {
    height: 24px;
    width: 24px;
  }
`;

const StyledDropDown = styled(DropDown)<{ error: boolean }>`
  border-radius: 12px;
  color: #7483ab;
  // ${({ error }) => error && 'border: 2px solid #ff6a60;'};
`;

const Transfer: React.FC = () => {
  const { gotoState } = useTransferContext();
  const { control, getValues, setValue, handleSubmit, watch } = useFormContext();

  // TODO: put get values in callback function
  const [token, isCustomToken, type] = getValues(['token', 'isCustomToken', 'type']);
  const transactionTypes = ['Withdraw', 'Deposit'];

  const context: any = useWallet();
  const { provider, account } = context;

  const goBack = () => {
    gotoState('selectToken');
  };

  const goNext = () => {
    setValue('title', transactionTypes[type]);
    gotoState('review');
  };

  const validateAmount = useCallback(
    async (value: string) => {
      const { token } = getValues();
      try {
        const asset = await Asset.createFromDropdownLabel(
          token.symbol,
          token.address,
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

  const renderToken = (token: any) => (
    <SelectedToken>
      <img src={token?.logo} />
      <p>{token?.symbol}</p>
    </SelectedToken>
  );

  return (
    <>
      <HeaderContainer>
        <Title>New transfer</Title>
      </HeaderContainer>
      <BodyContainer>
        <SubTitle>Type</SubTitle>
        <Description>Select type of transfer you wish to proceed.</Description>
        <InputContainer>
          <Controller
            name="type"
            control={control}
            defaultValue={0}
            render={({ field: { onChange, value } }) => (
              <ContentSwitcher items={transactionTypes} selected={value} onChange={onChange} />
            )}
          />
        </InputContainer>
        <SubTitle>Token</SubTitle>
        <InputContainer>
          <Controller
            name="token"
            control={control}
            rules={{ required: 'Please select a token' }}
            render={({ field: { value }, fieldState: { error } }) => {
              return (
                <StyledDropDown
                  wide
                  error={error?.message}
                  status={error ? 'error' : 'normal'}
                  items={[renderToken(value)]}
                  onClick={goBack}
                  onChange={goBack}
                  selected={token ? 0 : -1}
                  placeholder="Type to search ..."
                />
              );
            }}
          />
        </InputContainer>
        {isCustomToken && (
          <>
            <SubTitle>Token Address</SubTitle>
            <InputContainer>
              <Controller
                name="token.address"
                shouldUnregister={true}
                control={control}
                rules={{
                  required: 'Token address is required.',
                  validate: (value) => validateToken(value, provider),
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <StyledTextInput
                    value={value}
                    placeholder="0x ..."
                    onChange={onChange}
                    status={error ? 'error' : 'normal'}
                    error={error?.message}
                    wide
                  />
                )}
              />
            </InputContainer>
          </>
        )}
        <SubTitle>Amount</SubTitle>
        <InputContainer>
          <Controller
            name="depositAmount"
            control={control}
            rules={{
              required: 'Token amount is required.',
              validate: validateAmount,
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <StyledTextInput
                value={value}
                onChange={onChange}
                status={error ? 'error' : 'normal'}
                error={error?.message}
                wide
              />
            )}
          />
        </InputContainer>
        {!watch('type') && (
          <>
            <SubTitle>Recipient address</SubTitle>
            <Description>The assets will be transfered to this address.</Description>
            <InputContainer>
              <Controller
                name="recipient"
                control={control}
                defaultValue=""
                rules={{
                  required: 'This is required.',
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <StyledTextInput
                    value={value}
                    placeholder="0x ..."
                    onChange={onChange}
                    status={error ? 'error' : 'normal'}
                    error={error?.message}
                    wide
                  />
                )}
              />
            </InputContainer>
          </>
        )}
        <SubTitle>Reference</SubTitle>
        <Description>
          Add an optional reference copy to identify this transa&shy;ction later on.
        </Description>
        <InputContainer>
          <Controller
            name="reference"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <StyledTextInput
                value={value}
                onChange={onChange}
                status={error ? 'error' : 'normal'}
                error={error ? error.message : null}
                wide
              />
            )}
          />
        </InputContainer>
        {!watch('type') && (
          <>
            <SubTitle>Justification</SubTitle>
            <Description>
              Add a reason as a copy or file for scheduling this financial execution.
            </Description>
            <TextAreaContainer>
              <NewIPFSInput
                label=""
                placeholder="Please insert the reason why you want to execute this"
                textInputName="proof"
                fileInputName="proofFile"
              />
            </TextAreaContainer>
          </>
        )}
        <SubmitButton onClick={handleSubmit(goNext)}>
          <p>Review {transactionTypes[type]}</p>
          <IconDownload />
        </SubmitButton>
      </BodyContainer>
    </>
  );
};

export default Transfer;
