import React from 'react';
import cardMainImage from '../../../images/pngs/review_create_dao@2x.png';
import { EmptyStateCard, StyledText, useTheme } from '@aragon/ui';

const ReviewCard: React.FC = () => {
  const theme = useTheme();
  const cardText = (
    <div>
      <StyledText name={'title1'}>Please, take your time and review all the info!</StyledText>
      <StyledText name={'body2'} style={{ color: theme.disabledContent }}>
        Carefully review all of your settings.
      </StyledText>
    </div>
  );
  const cardIamge = <img style={{ width: '150px' }} src={cardMainImage}></img>;

  return (
    <EmptyStateCard
      illustration={cardIamge}
      text={cardText}
      style={{ width: '100%', padding: 24 }}
    />
  );
};

export default ReviewCard;
