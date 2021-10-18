import styled from 'styled-components';
import { Contract } from 'ethers';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, DropDown, GU, IconCopy, IconDownload, Tag, TextInput } from '@aragon/ui';

import { useWallet } from 'providers/AugmentedWallet';
import { formatUnits } from 'utils/lib';
import { getTokenInfo } from 'utils/token';
import { NewIPFSInput } from 'components/Field/NewIPFSInput';
import { erc20TokenABI } from 'abis/erc20';
import { ContentSwitcher } from 'components/ContentSwitcher/ContentSwitcher';
import { networkEnvironment } from 'environment';
import { useTransferContext } from './TransferContext';
import { ASSET_ICON_BASE_URL } from 'utils/constants';
import { Asset, OTHER_TOKEN_SYMBOL, ETH } from 'utils/Asset';
import { validateAmountForDecimals, validateBalance, validateToken } from 'utils/validations';

const { curatedTokens } = networkEnvironment;
const currentTokens = { ...curatedTokens, [ETH.symbol]: ETH.address };

const MAX_REFERENCE_LENGTH = 140;
export const transactionTypes = ['Deposit', 'Withdraw'];

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
  display: flex;
  flex-direction: column;
  gap: ${GU}px;
`;

const HintIndicator = styled.span`
  padding: 0px 16px;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: #7483ab;
  text-align: right;
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

const FallbackLogo = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 32px;
  background: linear-gradient(107.79deg, #00c2ff 1.46%, #01e8f7 100%);
`;

const StyledDropDown = styled(DropDown)`
  border-radius: 12px;
  color: #7483ab;
`;

const StyledTag = styled(Tag)`
  color: #7483ab;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;

  height: 23px;
  margin-left: ${GU}px;
  background: #eff1f7;
  border-radius: 8px;
`;

const Adornment = styled.span`
  margin-right: 6px;
  font-size: 16px;
  line-height: 24px;
  color: #00c2ff;
  cursor: pointer;
`;

const Transfer: React.FC = () => {
  const type: number = useWatch({ name: 'type' });
  const tokenAddress = useWatch({ name: 'token.address' });
  const isCustomToken = useWatch({ name: 'isCustomToken' });
  const isDeposit = useMemo(() => transactionTypes[type] === 'Deposit', [type]);
  const isWithdraw = useMemo(() => !isDeposit, [isDeposit]);

  const { gotoState } = useTransferContext();
  const [logoError, setLogoError] = useState<boolean>(false);
  const [tokenBalance, setBalance] = useState<string>();
  const { control, getValues, setValue, handleSubmit, formState } = useFormContext();

  const context: any = useWallet();
  const {
    balance,
    provider,
    account: { address: accountAddress },
  } = context;

  useEffect(() => {
    const getBalance = async () => {
      // No token or invalid token, no balance
      if (!tokenAddress || formState.errors.token?.address) {
        setBalance(undefined);
        return;
      }

      if (getValues('token.symbol') === 'ETH') {
        setBalance(formatUnits(balance, 18));
      }

      try {
        const contract = new Contract(tokenAddress, erc20TokenABI, provider);
        const { decimals } = await getTokenInfo(tokenAddress, provider);
        const currentBalance = await contract.balanceOf(accountAddress);
        setBalance(formatUnits(currentBalance, decimals));
      } catch (err) {
        // Passing invalid address will return error (can be safely ignored)
        // Should not throw ideally if bad address is taken into account
      }
    };

    getBalance();
  }, [accountAddress, balance, formState.errors.token?.address, getValues, provider, tokenAddress]);

  /**
   * Functions
   */
  const goBack = () => {
    gotoState('selectToken');
  };

  const goNext = () => {
    setValue('title', transactionTypes[type]);
    gotoState('review');
  };

  const validateAmount = useCallback(
    async (value: string) => {
      const token = getValues('token');

      if (!token?.address) return 'No token selected';

      // Invalid token address
      if (formState.errors?.token?.address)
        return 'Cannot validate amount with given token address';

      if (parseFloat(value) === 0) return 'Amount must be greater than zero';

      try {
        const asset = await Asset.createFromDropdownLabel(
          token.symbol in currentTokens ? token.symbol : OTHER_TOKEN_SYMBOL,
          token.address,
          value,
          provider,
        );

        const result = validateAmountForDecimals(value, asset.decimals);
        if (result !== true) {
          return result;
        }

        return validateBalance(asset, accountAddress, provider);
      } catch (err) {
        console.log('Error validating amount', err);
        return 'Error validating amount';
      }
    },
    [getValues, formState.errors?.token?.address, provider, accountAddress],
  );

  const tokenValidator = useCallback(
    async (address: string) => {
      const result = await validateToken(address, provider);

      // Valid non-curated token populates symbol
      if (getValues('isCustomToken') && result == true) {
        const { symbol } = await getTokenInfo(address, provider);
        setValue('token.symbol', symbol);
        setValue('token.logo', `${ASSET_ICON_BASE_URL}/${address}/logo.png`);
      } else {
        setValue('token.symbol', '');
        setValue('token.logo', null);
      }
      return result;
    },
    [getValues, provider, setValue],
  );

  const handleClipboardAction = useCallback(
    async (currentValue: string, onChange: (value: any) => void) => {
      if (currentValue) {
        await navigator.clipboard.writeText(currentValue);
      } else {
        const text = await navigator.clipboard.readText();
        onChange(text);
      }
    },
    [],
  );

  const renderToken = useCallback(
    (token: any) => {
      // Initial state
      if (!token) return '';

      if (!token.logo) {
        return (
          <SelectedToken>
            {token.symbol !== '' && <FallbackLogo />}
            <p>{token.symbol}</p>
          </SelectedToken>
        );
      }

      return (
        <SelectedToken>
          {logoError ? (
            <FallbackLogo />
          ) : (
            <img src={token.logo} alt="token logo" onError={() => setLogoError(true)} />
          )}
          <p>{token.symbol}</p>
        </SelectedToken>
      );
    },
    [logoError],
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
                  selected={value ? 0 : -1}
                  placeholder="Select a token ..."
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
                defaultValue=""
                control={control}
                rules={{
                  required: 'Token address is required.',
                  validate: tokenValidator,
                }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <StyledTextInput
                    value={value}
                    placeholder="0x ..."
                    onChange={onChange}
                    status={error ? 'error' : 'normal'}
                    error={error?.message}
                    wide
                    adornment={
                      <Adornment onClick={() => handleClipboardAction(value, onChange)}>
                        {value ? <IconCopy /> : 'Paste'}
                      </Adornment>
                    }
                    adornmentPosition="end"
                  />
                )}
              />
            </InputContainer>
          </>
        )}
        <SubTitle>Amount</SubTitle>
        <InputContainer>
          <Controller
            name="amount"
            defaultValue=""
            control={control}
            rules={{
              required: 'Token amount is required.',
              validate: validateAmount,
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <StyledTextInput
                  wide
                  value={value}
                  onChange={onChange}
                  status={error ? 'error' : 'normal'}
                  error={error?.message}
                  adornment={
                    isDeposit && <Adornment onClick={() => onChange(tokenBalance)}>Max</Adornment>
                  }
                  adornmentPosition="end"
                />
                {isDeposit && tokenBalance && (
                  <HintIndicator>Max Balance: {tokenBalance}</HintIndicator>
                )}
              </>
            )}
          />
        </InputContainer>
        {isWithdraw && (
          <>
            <SubTitle>Recipient address</SubTitle>
            <Description>The assets will be transferred to this address.</Description>
            <InputContainer>
              <Controller
                name="recipient"
                control={control}
                defaultValue=""
                rules={{ required: 'This is required.' }}
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
        <SubTitle>
          Reference<StyledTag>Optional</StyledTag>
        </SubTitle>
        <Description>
          Add an optional reference copy to identify this transa&shy;ction later on.
        </Description>
        <InputContainer>
          <Controller
            name="reference"
            control={control}
            defaultValue=""
            rules={{
              maxLength: {
                value: MAX_REFERENCE_LENGTH,
                message: 'Please keep description short',
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <StyledTextInput
                  value={value}
                  onChange={onChange}
                  status={error ? 'error' : 'normal'}
                  error={error?.message}
                  wide
                />
                <HintIndicator>
                  {value?.length}/{MAX_REFERENCE_LENGTH}
                </HintIndicator>
              </>
            )}
          />
        </InputContainer>
        {isWithdraw && (
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
