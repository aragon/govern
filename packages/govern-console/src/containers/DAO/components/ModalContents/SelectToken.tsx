import styled from 'styled-components';
import { IconLeft, IconPlus, TextInput, GU } from '@aragon/ui';

const HeaderContainer = styled.div`
  display: flex;
`;

const BackButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #eaf0fa;
  border-radius: 8px;
  width: 40px;
  height: 40px;
`;

const Title = styled.p`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  padding-left: 16px;
`;

const SearchContainer = styled.div`
  margin-top: ${3 * GU}px;
  width: 100%;
  margin-bottom: 12px;
`;

const TokenCardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
`;

const AddTokenContainer = styled.div`
  display: flex;
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  align-items: center;
  justify-content: center;
  color: #00c2ff;
  font-size: 16px;
  line-height: 125%;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TokenLogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TokenLogo = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 100%;
`;

const TokenTitle = styled.p`
  font-weight: 600;
  font-size: 16px;
  line-height: 125%;
  margin: 4px 0px;
`;

const Tokenaddress = styled.p`
  font-weight: 500;
  font-size: 16px;
  line-height: 150%;
  color: #7483ab;
`;

const TokenCard = () => {
  return (
    <TokenCardContainer>
      <InfoContainer>
        <TokenTitle>ANJ</TokenTitle>
        <Tokenaddress>0xcD62b1C403fa....e2B51780b184</Tokenaddress>
      </InfoContainer>
      <TokenLogoContainer>
        <TokenLogo src="https://cryptologos.cc/logos/aragon-ant-logo.png" />
      </TokenLogoContainer>
    </TokenCardContainer>
  );
};

const SelectToken: React.FC = () => {
  return (
    <>
      <HeaderContainer>
        <BackButton>
          <IconLeft />
        </BackButton>
        <Title>Select Token</Title>
      </HeaderContainer>
      <SearchContainer>
        <TextInput
          css={`
            width: 100%;
            border-radius: 12px;
          `}
          placeholder="Type to search ..."
        />
      </SearchContainer>
      <TokenCard />
      <TokenCard />
      <TokenCard />
      <TokenCard />
      <AddTokenContainer>
        <p
          css={`
            padding-right: 12px;
          `}
        >
          Add other token
        </p>
        <IconPlus />
      </AddTokenContainer>
    </>
  );
};

export default SelectToken;
