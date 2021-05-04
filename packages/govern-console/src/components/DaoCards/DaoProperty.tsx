import React from 'react';
import MUITypography from '@material-ui/core/Typography';
import { styled, Theme } from '@material-ui/core/styles';

const DaoPropertyLabel = styled(MUITypography)(({ theme }) => ({
  color: theme.custom.daoCard.propertyLabelColor,
  lineHeight: theme.custom.daoCard.propertyLabelLineHeight,
  fontSize: theme.custom.daoCard.propertLabelFontSize,
  fontWeight: theme.custom.daoCard.propertyLabelFontWeight,
  fontFamily: theme.custom.daoCard.fontFamily,
  fontStyle: theme.custom.daoCard.fontStyle,
}));
const DaoPropertyText = styled(MUITypography)(({ theme }) => ({
  color: theme.custom.daoCard.propertyTextColor,
  lineHeight: theme.custom.daoCard.propertyTextLineHeight,
  fontSize: theme.custom.daoCard.propertyTextFontSize,
  fontWeight: theme.custom.daoCard.propertyTextFontWeight,
  fontFamily: theme.custom.daoCard.fontFamily,
  fontStyle: theme.custom.daoCard.fontStyle,
}));

const DaoProperty: React.FC<any> = ({ propertyLabel, propertyText }) => {
  return (
    <div
      style={{
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <DaoPropertyLabel>{propertyLabel}</DaoPropertyLabel>
      <DaoPropertyText>{propertyText}</DaoPropertyText>
    </div>
  );
};

export default DaoProperty;
