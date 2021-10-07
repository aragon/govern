import styled from 'styled-components';
import { useCallback, useMemo, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { DropDown, GU, TextInput, Button, IconDownload, ContentSwitcher } from '@aragon/ui';
import { constants } from 'ethers';

import { Asset } from 'utils/Asset';
import { useWallet } from 'providers/AugmentedWallet';
import { useTransferContext } from './TransferContext';
import { validateAmountForDecimals, validateBalance } from 'utils/validations';

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

const SelectorContainer = styled.div`
  display: flex;
  width: 100%;
  height: 44px;
  background: #ffffff;
  margin-top: ${GU}px;
  margin-bottom: ${3 * GU}px;
  border-radius: 12px;
  padding: 4px;
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  background: #ffffff;
  border-radius: 12px;
  font-weight: 600;
  color: #7483ab;
  cursor: pointer;
  &.active {
    background: #f0fbff;
    color: #00c2ff;
    cursor: auto;
  }
`;

const StyledContentSwitcher = styled(ContentSwitcher)`
  & > div > ul {
    width: 100%;
  }
  & > div > ul > li {
    width: 100%;
  }
  & > div > ul > li > button {
    width: 50%;
  }
`;

const NewTransfer: React.FC = () => {
  const { gotoState } = useTransferContext();
  const { control, getValues, handleSubmit } = useFormContext();
  // const [showRecipient, setShowRecipient] = useState<boolean>(false);
  const token = getValues('token');
  // const typeList = ['deposit', 'withdraw'];

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

  // const SwitchChange = (index: number, onChange: (value: string) => void) => {
  //   onChange(typeList[index]);
  //   setShowRecipient(typeList[index] === 'withdraw');
  // };

  // const RenderRecipientAddress = useMemo(() => {
  //   return (
  //     <>
  //       {showRecipient && (
  //         <InputContainer>
  //           <Controller
  //             name="recipient"
  //             control={control}
  //             rules={{
  //               required: 'This is required.',
  //             }}
  //             shouldUnregister
  //             render={({ field: { onChange, value }, fieldState: { error } }) => (
  //               <TextInput
  //                 wide
  //                 title={<SubTitle>Recipient address</SubTitle>}
  //                 subtitle={
  //                   <Description>The assets will be transfered to this address.</Description>
  //                 }
  //                 value={value}
  //                 onChange={onChange}
  //                 status={error ? 'error' : 'normal'}
  //                 error={error ? error.message : null}
  //               />
  //             )}
  //           />
  //         </InputContainer>
  //       )}
  //     </>
  //   );
  // }, [showRecipient, control]);

  const renderToken = (token: any) => {
    return (
      <SelectedToken>
        <img src={token?.logo} />
        <p>{token?.symbol}</p>
      </SelectedToken>
    );
  };
  return (
    <>
      <HeaderContainer>
        <Title>New transfer</Title>
      </HeaderContainer>
      <BodyContainer>
        {/* TODO: Connect this to react-hook-form; receive props from NewTransfer parent */}

        {/* <SubTitle>Type</SubTitle>
        <Description>Select type of transfer you wish to proceed.</Description> */}
        {/* <Controller
          name="type"
          control={control}
          defaultValue={'deposit'}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <StyledContentSwitcher
              title={<SubTitle>Type</SubTitle>}
              subtitle={<Description>Select type of transfer you wish to proceed.</Description>}
              items={typeList}
              selected={typeList.indexOf(value)}
              onChange={(index: number) => SwitchChange(index, onChange)}
              wide
            />
          )}
        /> */}

        {/* While this conditionally rendering looks like a good option,
            it might be a headache for react-hook-form. Implement withdraw and 
            deposit separately
        */}

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
        {/* {RenderRecipientAddress} */}
        <SubTitle>Amount</SubTitle>
        <InputContainer>
          <Controller
            name="depositAmount"
            control={control}
            rules={{
              required: 'This is required.',
              validate: validateAmount,
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextInput
                css={`
                  border-radius: 12px;
                `}
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
              <TextInput
                css={`
                  border-radius: 12px;
                `}
                wide
                value={value}
                onChange={onChange}
                status={error ? 'error' : 'normal'}
                error={error ? error.message : null}
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

export default NewTransfer;
