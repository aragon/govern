import styled from 'styled-components';
import { GU, TextInput, IconDown, Button, IconDownload } from '@aragon/ui';

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

const TypeSelector = () => {
  return (
    <SelectorContainer>
      <Option className="active">Deposit</Option>
      <Option>WithDraw</Option>
    </SelectorContainer>
  );
};

const NewTransfer: React.FC = () => {
  return (
    <>
      <HeaderContainer>
        <Title>New transfer</Title>
      </HeaderContainer>
      <BodyContainer>
        <SubTitle>Type</SubTitle>
        <Description>Select type of transfer you wish to proceed.</Description>
        <TypeSelector />
        <SubTitle>Token</SubTitle>
        <InputContainer>
          <TextInput
            css={`
              border-radius: 12px;
            `}
            wide
            adornmentPosition="end"
            placeholder="Type to search ..."
            adornment={<IconDown />}
          />
        </InputContainer>
        <SubTitle>Amount</SubTitle>
        <InputContainer>
          <TextInput
            css={`
              border-radius: 12px;
            `}
            wide
          />
        </InputContainer>
        <SubTitle>Reference</SubTitle>
        <Description>
          Add an optional reference copy to identify this transa- ction later on.
        </Description>
        <InputContainer>
          <TextInput
            css={`
              border-radius: 12px;
            `}
            wide
          />
        </InputContainer>
        <SubmitButton>
          <p>Review deposit</p>
          <IconDownload />
        </SubmitButton>
      </BodyContainer>
    </>
  );
};

export default NewTransfer;
