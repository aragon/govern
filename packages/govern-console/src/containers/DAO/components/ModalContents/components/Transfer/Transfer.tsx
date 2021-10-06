import { useState, useCallback } from 'react';
import styled from 'styled-components';
import {
  ContentSwitcher,
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

const TypeSelector = () => {
  return (
    <SelectorContainer>
      <Option className="active">Deposit</Option>
      <Option>WithDraw</Option>
    </SelectorContainer>
  );
};

const Transfer: React.FC<props> = ({ next, methods, buildActions, setShowSelectToken }) => {
  const [selected, setSelected] = useState<number>();
  const { control, handleSubmit } = methods;

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

        <SubTitle>Type</SubTitle>
        <Description>Select type of transfer you wish to proceed.</Description>
        <TypeSelector />

        {/* While this conditionally rendering looks like a good option,
            it might be a headache for react-hook-form. Implement withdraw and 
            deposit separately
        */}
        <SubTitle>Token</SubTitle>
        <InputContainer>
          <TextInput
            css={`
              border-radius: 12px;
            `}
            onClick={setShowSelectToken}
            wide
            adornmentPosition="end"
            placeholder="Type to search ..."
            adornment={<IconDown />}
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
        <SubmitButton
          onClick={() => {
            buildActions();
            next();
          }}
        >
          <p>Review deposit</p>
          <IconDownload />
        </SubmitButton>
      </BodyContainer>
    </>
  );
};

export default Transfer;
