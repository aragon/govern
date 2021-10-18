import React from 'react';
import styled from 'styled-components';

const TokenNotFoundTextWrapper = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
`;

const TokenNotFoundTextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TokenNotFoundTitle = styled.p`
  line-height: 20px;
  font-weight: 600;
`;

const TokenNotFoundSubtitle = styled.p`
  line-height: 24px;
  color: #7483ab;
`;

const TokenNotFound: React.FC = () => {
  return (
    <TokenNotFoundTextWrapper>
      <TokenNotFoundTextContent>
        <TokenNotFoundTitle>Token not found</TokenNotFoundTitle>
        <TokenNotFoundSubtitle>Add your custom Token to deposit</TokenNotFoundSubtitle>
      </TokenNotFoundTextContent>
    </TokenNotFoundTextWrapper>
  );
};
export default React.memo(TokenNotFound);
