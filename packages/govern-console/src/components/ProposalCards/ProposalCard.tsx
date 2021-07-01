import React from 'react';
import { Label } from '../Labels/Label';
import { Box, StyledText, useTheme, GU } from '@aragon/ui';

export interface ProposalCardProps {
  /**
   * TransactionHash of the proposal
   */
  transactionHash: string;
  /**
   * Title of the proposal
   */
  proposalTitle: string;
  /**
   * Date of proposal
   */
  proposalDate: string | React.ReactNode;
  /**
   * Status of the proposal
   */
  proposalStatus: string;
  /**
   * Status of the proposal
   */
  proposalStatusColor: string;
  /**
   * Optional Function Handler
   */
  onClickProposalCard?: () => void;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  transactionHash,
  proposalTitle,
  proposalDate,
  proposalStatus,
  proposalStatusColor,
  onClickProposalCard,
}) => {
  const theme = useTheme();

  const getSlicedTransactionHash = () => {
    const hash =
      transactionHash.slice(0, 6) +
      '...' +
      transactionHash.slice(transactionHash.length - 5, transactionHash.length - 1);
    return hash;
  };

  return (
    <Box shadow onClick={onClickProposalCard} style={{ cursor: 'pointer' }}>
      <Label labelColor={proposalStatusColor} labelText={proposalStatus} />
      <StyledText
        name="header6"
        style={{
          lineHeight: 1.25,
          marginTop: GU,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        {proposalTitle || getSlicedTransactionHash()}{' '}
      </StyledText>
      <StyledText
        name="title3"
        style={{
          color: theme.disabledContent,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        {proposalDate}
      </StyledText>
    </Box>
  );
};
