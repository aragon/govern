import styled from 'styled-components';
import { useCallback } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { DropDown, GU, TextInput, Button, IconDownload } from '@aragon/ui';

import { Asset } from 'utils/Asset';
import { useWallet } from 'providers/AugmentedWallet';
import { useTransferContext } from '../../TransferContext';
import { validateAmountForDecimals, validateBalance, validateToken } from 'utils/validations';

const HeaderContainer = styled.div`
  display: flex;
  padding-bottom: 10px;
  margin-bottom: ${3 * GU}px;
`;

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
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
  margin: 4px 0px;
`;

const Description = styled.p`
  color: #7483ab;
  font-weight: 500;
  font-size: 16px;
  line-height: 150%;
`;

const InputContainer = styled.div`
  margin-top: ${GU}px;
  margin-bottom: ${3 * GU}px;
`;

const StyledTextInput = styled(TextInput)`
  border-radius: 12px;
`;

const SubmitButton = styled(Button)`
  height: 48px;
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
  const { control, getValues, handleSubmit } = useFormContext();

  // TODO: put get values in callback function
  const [token, isCustomToken] = getValues(['token', 'isCustomToken']);

  const context: any = useWallet();
  const { provider, account } = context;

  const goBack = () => {
    gotoState('selectToken');
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
        <SubTitle>Reference</SubTitle>
        <Description>
          Add an optional reference copy to identify this transa- ction later on.
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
        <SubmitButton onClick={handleSubmit(() => gotoState('review'))}>
          <p>Review deposit</p>
          <IconDownload />
        </SubmitButton>
      </BodyContainer>
    </>
  );
};

export default Transfer;
