import React from 'react';
import { styled, useTheme } from '@material-ui/core/styles';
import MUICard, { CardProps } from '@material-ui/core/Card';
import MUITypography from '@material-ui/core/Typography';
import { Label } from '../Labels/Label';

export interface ProposalCardProps {
  /**
   * TransactionHash of the proposal
   */
  transactionHash: string;
  /**
   * Date of proposal
   */
  proposalDate: string | React.ReactNode;
  /**
   * Status of the proposal
   */
  proposalStatus: string;
  /**
   * Optional Function Handler
   */
  onClickProposalCard?: () => void;
}

const ProposalCardWrapper = styled(MUICard)(({ theme }) => ({
  backgroundColor: theme.custom.proposalCard.background,
  height: '150px',
  // width: '400px',
  border: `2px solid ${theme.custom.proposalCard.border}`,
  paddingLeft: '0px',
  paddingTop: '21px',
  borderRadius: '8px',
  boxSizing: 'border-box',
  boxShadow: '0px 6px 6px rgba(180, 193, 228, 0.35)',
  cursor: 'pointer',
}));

const ProposalHash = styled(MUITypography)(({ theme }) => ({
  color: theme.custom.proposalCard.labelColor,
  lineHeight: theme.custom.proposalCard.labelLineHeight,
  fontSize: theme.custom.proposalCard.labelFontSize,
  fontWeight: theme.custom.proposalCard.labelFontWeight,
  fontFamily: theme.custom.proposalCard.fontFamily,
  fontStyle: theme.custom.proposalCard.fontStyle,
  marginTop: '14px',
  marginLeft: '32px',
  textAlign: 'center',
}));

const ProposalDateText = styled(MUITypography)(({ theme }) => ({
  color: theme.custom.proposalCard.dateColor,
  lineHeight: theme.custom.proposalCard.dateLineHeight,
  fontSize: theme.custom.proposalCard.dateFontSize,
  fontWeight: theme.custom.proposalCard.dateFontWeight,
  fontFamily: theme.custom.proposalCard.fontFamily,
  fontStyle: theme.custom.proposalCard.fontStyle,
  marginTop: '14px',
  marginLeft: '32px',
  textAlign: 'center',
}));

const getLabelColor = (proposalStatus: string) => {
  if (proposalStatus === 'Scheduled') return 'grey';
  if (proposalStatus === 'Executed') return 'purple';
  if (proposalStatus === 'Challenged') return 'orange';
  if (proposalStatus === 'Rejected') return 'red';
  if (proposalStatus === 'Approved') return 'green';
  if (proposalStatus === 'Executable') return 'lightBlue';
  if (proposalStatus === 'Vetoed') return 'black';
};

const getLabelText = (proposalStatus: string) => {
  if (proposalStatus === 'Scheduled') return 'Scheduled';
  if (proposalStatus === 'Executed') return 'Executed';
  if (proposalStatus === 'Challenged') return 'Challenged';
  if (proposalStatus === 'Rejected') return 'Ruled Negetively';
  if (proposalStatus === 'Approved') return 'Ruled Positively';
  if (proposalStatus === 'Executable') return 'Executable';
  if (proposalStatus === 'Vetoed') return 'Vetoed';
};

const LabelWrapper = styled('div')({
  marginLeft: '32px',
});

export const ProposalCard: React.FC<ProposalCardProps> = ({
  transactionHash,
  proposalDate,
  proposalStatus,
  onClickProposalCard,
  ...props
}) => {
  const theme = useTheme();

  const getSlicedTransactionHash = () => {
    const hash =
      transactionHash.slice(0, 6) +
      '...' +
      transactionHash.slice(
        transactionHash.length - 5,
        transactionHash.length - 1,
      );
    return hash;
  };

  return (
    <ProposalCardWrapper onClick={onClickProposalCard}>
      <LabelWrapper>
        <Label
          labelColor={getLabelColor(proposalStatus)}
          labelText={getLabelText(proposalStatus)}
        />
      </LabelWrapper>
      <ProposalHash>{getSlicedTransactionHash()}</ProposalHash>
      <ProposalDateText>{proposalDate}</ProposalDateText>
    </ProposalCardWrapper>
  );
};
