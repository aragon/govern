import styled from 'styled-components';
import { IconLeft, IconPlus, TextInput, GU } from '@aragon/ui';
import { getEnvironmentName, networkEnvironment } from 'environment';
import { ETH } from 'utils/Asset';
import { getNetworkConfig } from 'environment/networks';
import { getTruncatedAccountAddress } from 'utils/account';

const depositAssets: any = {
  ...getNetworkConfig(getEnvironmentName()).curatedTokens,
  [ETH.symbol]: ETH.address,
};

type props = {
  setShowSelectToken: () => void;
  onSelectToken: (value: any) => void;
};

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

const TokenAddress = styled.p`
  font-weight: 500;
  font-size: 16px;
  line-height: 150%;
  color: #7483ab;
`;

type TokenCardProps = {
  symbol: string;
  address: string;
  key: string;
  onClick: (value: any) => void;
};

const TokenCard: React.FC<TokenCardProps> = ({ symbol, address, onClick }) => {
  const logo = 'https://cryptologos.cc/logos/aragon-ant-logo.png';
  return (
    <TokenCardContainer onClick={() => onClick({ symbol, address, logo })}>
      <InfoContainer>
        <TokenTitle>{symbol}</TokenTitle>
        <TokenAddress>{getTruncatedAccountAddress(address)}</TokenAddress>
      </InfoContainer>
      <TokenLogoContainer>
        <TokenLogo src={logo} />
      </TokenLogoContainer>
    </TokenCardContainer>
  );
};

const SelectToken: React.FC<props> = ({ setShowSelectToken, onSelectToken }) => {
  return (
    <>
      <HeaderContainer>
        <BackButton onClick={setShowSelectToken}>
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
      {Object.keys(depositAssets).map((assetName) => {
        return (
          <TokenCard
            key={assetName}
            symbol={assetName}
            address={depositAssets[assetName]}
            onClick={onSelectToken}
          />
        );
      })}

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
