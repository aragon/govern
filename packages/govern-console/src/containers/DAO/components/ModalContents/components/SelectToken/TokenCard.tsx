import styled from 'styled-components';

import ETHIcon from 'images/pngs/eth_logo.png';
import { ASSET_ICON_BASE_URL } from 'utils/constants';
import { getTruncatedAccountAddress } from 'utils/account';

const logoAddresses: any = {
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
};

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
  const logo =
    symbol === 'ETH' ? ETHIcon : `${ASSET_ICON_BASE_URL}/${logoAddresses[symbol]}/logo.png`;

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
