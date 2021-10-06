import { useState, useCallback } from 'react';
import styled from 'styled-components';
import {
  ContentSwitcher,
  DropDown,
  GU,
  TextInput,
  IconDown,
  Button,
  IconDownload,
  useToast,
} from '@aragon/ui';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { Asset, AssetLabel, ETH, OTHER_TOKEN_SYMBOL } from 'utils/Asset';
import { useWallet } from 'providers/AugmentedWallet';
import { validateAmountForDecimals, validateToken, validateBalance } from 'utils/validations';
import { AssetWithdrawal } from 'components/ActionBuilder/Screens/AssetWithdrawal';
import { useActionBuilderState } from 'components/ActionBuilder/ActionBuilderStateProvider';
import { getErrorFromException } from 'utils/HelperFunctions';
import { Executor } from 'services/Executor';

type props = {
  next: () => void;
  methods: any;
  buildActions: () => void;
  setShowSelectToken: () => void;
};

type DepositFormData = {
  token: number;
  tokenContractAddress: string;
  depositAmount: string;
  reference?: string;
};

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

// const SelectorContainer = styled.div`
//   display: flex;
//   width: 100%;
//   height: 44px;
//   background: #ffffff;
//   margin-top: ${GU}px;
//   margin-bottom: ${3 * GU}px;
//   border-radius: 12px;
//   padding: 4px;
// `;

// const Option = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 50%;
//   background: #ffffff;
//   border-radius: 12px;
//   font-weight: 600;
//   color: #7483ab;
//   cursor: pointer;
//   &.active {
//     background: #f0fbff;
//     color: #00c2ff;
//     cursor: auto;
//   }
// `;

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

const CustomeContentSwitcher = styled(ContentSwitcher)`
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

const Transfer: React.FC<props> = ({ next, methods, buildActions, setShowSelectToken }) => {
  const [selected, setSelected] = useState<number>();
  const { control, handleSubmit, getValues } = methods;

  function renderToken(token: any) {
    return (
      <SelectedToken>
        <img src={token?.logo} />
        <p>{token?.symbol}</p>
      </SelectedToken>
    );
  }
  const token = getValues('token');
  return (
    <>
      <HeaderContainer>
        <Title>New transfer</Title>
      </HeaderContainer>
      <BodyContainer>
        {/* TODO: Connect this to react-hook-form; receive props from NewTransfer parent */}
        {/* <CustomeContentSwitcher
          title={<SubTitle>Type</SubTitle>}
          subtitle={<Description>Select type of transfer you wish to proceed.</Description>}
          items={['Deposit', 'Withdraw']}
          onChange={(value: number) => setSelected(value)}
          selected={selected}
          wide
        /> */}

        {/* While this conditionally rendering looks like a good option,
            it might be a headache for react-hook-form. Implement withdraw and 
            deposit separately
        */}

        {/*
       <Controller
          name="token"
          control={control}
          defaultValue={null}
          render={({ field: { onChange } }) => (
            <SelectToken
              setShowSelectToken={() => setShowSelectToken(false)}
              onSelectToken={(value) => {
                setShowSelectToken(false);
                onChange(value);
              }}
            />
          )}
        />
      )  */}
        <SubTitle>Token</SubTitle>
        <InputContainer>
          <Controller
            name="token"
            control={control}
            rules={{ required: 'Please select a token' }}
            render={({ field: { value }, fieldState: { error } }) => {
              return (
                <StyledDropDown
                  error={error?.message}
                  items={[renderToken(value)]}
                  placeholder="Type to search ..."
                  wide
                  selected={token ? 0 : -1}
                  onClick={setShowSelectToken}
                  // Workaround so component isn't both controlled
                  // and uncontrolled
                  onChange={setShowSelectToken}
                />
              );
            }}
          />
        </InputContainer>
        <SubTitle>Amount</SubTitle>
        <InputContainer>
          <Controller
            name="depositAmount"
            control={control}
            rules={{
              required: 'This is required.',
              // validate: validateAmount,
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextInput
                css={`
                  border-radius: 12px;
                `}
                value={value}
                onChange={onChange}
                status={error ? 'error' : 'normal'}
                error={error ? error.message : null}
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
        <SubmitButton onClick={handleSubmit(buildActions)}>
          <p>Review deposit</p>
          <IconDownload />
        </SubmitButton>
      </BodyContainer>
    </>
  );
};

export default Transfer;
