import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';
import { useCallback, useMemo, useState } from 'react';
import { ButtonText, IconLeft, IconAdd, TextInput, GU } from '@aragon/ui';

import { ETH } from 'utils/Asset';
import TokenCard from './TokenCard';
import TokenNotFound from './TokenNotFound';
import { useTransferContext } from '../../TransferContext';
import { networkEnvironment } from 'environment';

const { curatedTokens } = networkEnvironment;
const depositAssets: any = {
  ...curatedTokens,
  [ETH.symbol]: ETH.address,
};

type Props = {
  onTokenSelected: (value: any) => void;
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

const StyledInput = styled(TextInput)`
  width: 100%;
  border-radius: 12px;
`;

const TokenListContainer = styled.div`
  gap: 12px;
  display: flex;
  flex-direction: column;
`;

const AddTokenButton = styled(ButtonText)`
  height: 44px;
  display: flex;
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  align-items: center;
  justify-content: center;
  color: #00c2ff;
  font-size: 16px;
  line-height: 125%;

  & > p {
    padding-right: 12px;
  }
`;

const SelectToken: React.FC<Props> = ({ onTokenSelected }) => {
  const { setValue } = useFormContext();
  const { gotoState } = useTransferContext();
  const [query, setSearchQuery] = useState<string>('');

  const searchDeposit = useCallback(
    (assetName: string) => {
      const regex = new RegExp(query, 'i');
      if (assetName.match(regex) || query === '') return assetName;
    },
    [query],
  );

  const { assets, noAssets } = useMemo((): { assets: string[]; noAssets: boolean } => {
    const assets = Object.keys(depositAssets).filter(searchDeposit);
    return {
      assets,
      noAssets: assets.length === 0,
    };
  }, [searchDeposit]);

  const handleAddToken = () => {
    setValue('isCustomToken', true);
    setValue('token', { symbol: query });
    gotoState('initial');
  };

  const renderTokenList = () => {
    return noAssets ? (
      <TokenNotFound />
    ) : (
      assets.map((assetName) => (
        <TokenCard
          key={assetName}
          symbol={assetName}
          address={depositAssets[assetName]}
          onClick={onTokenSelected}
        />
      ))
    );
  };

  return (
    <>
      <HeaderContainer>
        <BackButton onClick={() => gotoState('initial')}>
          <IconLeft />
        </BackButton>
        <Title>Select Token</Title>
      </HeaderContainer>
      <SearchContainer>
        <StyledInput
          value={query}
          onChange={(e: any) => setSearchQuery(e.target.value)}
          placeholder="Type to search ..."
        />
      </SearchContainer>
      <TokenListContainer>
        <AddTokenButton onClick={handleAddToken}>
          <p>Add {noAssets ? `${query} now` : `other token`}</p>
          <IconAdd />
        </AddTokenButton>
        {renderTokenList()}
      </TokenListContainer>
    </>
  );
};

export default SelectToken;
