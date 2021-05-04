import React from 'react';
import { styled, Theme } from '@material-ui/core/styles';
import MUICard, { CardProps } from '@material-ui/core/Card';
import MUITypography from '@material-ui/core/Typography';

export interface AdviceMessageProps extends CardProps {
  /**
   * Card Color
   */
  cardColor: string;
  /**
   * Card Text
   */
  messageText: string | React.ReactNode;
  /**
   * Optional Function Handler
   */
  onClick?: () => void;
}

const getBackground = (theme: Theme, cardColor: string) => {
  if (cardColor === 'green') return `${theme.custom.light.grass}`;
  if (cardColor === 'orange') return `${theme.custom.light.cream}`;
  if (cardColor === 'blue') return `${theme.custom.light.sky}`;
  if (cardColor === 'grey') return `${theme.custom.greyscale.light}`;
};

const getColor = (theme: Theme, cardColor: string) => {
  if (cardColor === 'green') return `${theme.custom.informative.green}`;
  if (cardColor === 'orange') return `${theme.custom.informative.orange}`;
  if (cardColor === 'blue') return `${theme.custom.plain.sapphire}`;
  if (cardColor === 'grey') return `${theme.custom.greyscale.solid}`;
};

const AdviceMessageCard = styled(MUICard)(
  ({ theme, cardColor }: { theme: Theme; cardColor: string }) => ({
    backgroundColor: getBackground(theme, cardColor),
    width: '293px',
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px 16px',
    borderRadius: '10px',
  }),
);

const AdviceMessageText = styled(MUITypography)(
  ({ theme, cardColor }: { theme: Theme; cardColor: string }) => ({
    color: getColor(theme, cardColor),
    lineHeight: '19px',
    fontSize: '14px',
    fontWeight: 500,
    fontFamily: 'Manrope',
    fontStyle: 'normal',
    overflow: 'visible',
  }),
);

export const AdviceMessage: React.FC<any> = ({ cardColor, messageText }) => {
  return (
    <AdviceMessageCard cardColor={cardColor}>
      <AdviceMessageText cardColor={cardColor}>{messageText}</AdviceMessageText>
    </AdviceMessageCard>
  );
};
