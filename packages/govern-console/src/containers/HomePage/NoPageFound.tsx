import React, { memo } from 'react';
import styled from 'styled-components';
import { Button } from '@aragon/ui';
import { useHistory } from 'react-router-dom';
import daoNoutFound from 'images/dao-not-found.svg';

const Subtitle = styled.p`
  color: #7483ab;
  line-height: 27px;
  font-size: 18px;
  font-weight: 500;
`;

const Title = styled.p`
  color: #20232c;
  line-height: 30px;
  font-size: 24px;
  font-weight: 600;
  font-style: normal;
  padding-bottom: 8px;
`;

const DaoNotFoundWrapper = styled.div`
  height: 100%;
  text-align: center;
  background: linear-gradient(107.79deg, #e4f8ff 1.46%, #f1f1ff 100%);
  border-radius: 16px;
  box-sizing: border-box;
  padding: 120px 32px 0px 32px;
`;

const NavigationbuttonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
`;

const NotFoundImage = styled.img`
  width: 236px;
  height: 225px;
`;

const NavigationButton = styled(Button)`
  width: 186px;
  height: 40px;
  border-radius: 12px;
  box-shadow: none;
  font-size: 16px;
  padding: 8px 16px;
`;

const NoPageFound: React.FC = () => {
  const history = useHistory();

  const onGotoDao = () => {
    history.push(`/`);
  };

  return (
    <>
      <DaoNotFoundWrapper>
        <NotFoundImage src={daoNoutFound} />
        <Title>This page is lost.</Title>
        <Subtitle>
          We've explored deep and wide, but we can't find the page you were looking for.
        </Subtitle>
        <NavigationbuttonContainer>
          <NavigationButton
            buttonType="primary"
            type="submit"
            label="Navigate back home"
            onClick={onGotoDao}
          />
        </NavigationbuttonContainer>
      </DaoNotFoundWrapper>
    </>
  );
};
export default memo(NoPageFound);
