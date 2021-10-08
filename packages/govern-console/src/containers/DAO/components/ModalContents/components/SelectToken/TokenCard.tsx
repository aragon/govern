import styled from 'styled-components';

import { getTruncatedAccountAddress } from 'utils/account';

type Props = {
  key: string;
  symbol: string;
  address: string;
  onClick: (value: any) => void;
};

const TokenCardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
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

const TokenCard: React.FC<Props> = ({ symbol, address, onClick }) => {
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

export default TokenCard;
