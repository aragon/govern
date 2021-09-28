import styled from 'styled-components';
import { GU } from '@aragon/ui';

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

const NewTransfer: React.FC = () => {
  return (
    <>
      <HeaderContainer>
        <Title>New transfer</Title>
      </HeaderContainer>
      <BodyContainer>
        <SubTitle>Type</SubTitle>
        <Description>Select type of transfer you wish to proceed.</Description>
      </BodyContainer>
    </>
  );
};

export default NewTransfer;
