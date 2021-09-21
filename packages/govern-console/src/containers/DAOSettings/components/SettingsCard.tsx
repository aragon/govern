/**
 * TODO: Unused component. To be removed.
 */

import React from 'react';
import cardMainImage from 'images/pngs/dao_setting_@2x.png';
import { EmptyStateCard, StyledText, useTheme } from '@aragon/ui';

const SettingsCard: React.FC = () => {
  const theme = useTheme();
  const cardText = (
    <div>
      <StyledText name={'title1'}>Your DAO settings</StyledText>
      <StyledText name={'body4'} style={{ color: theme.disabledContent }}>
        Carefully review your changes as some settings may break or lock your DAO.
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

export default SettingsCard;
