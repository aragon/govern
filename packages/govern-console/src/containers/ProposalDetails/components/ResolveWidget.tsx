/* eslint-disable */
import React, { memo } from 'react';
import { ANButton } from 'components/Button/ANButton';
import { PROPOSAL_STATES } from 'utils/states';
import { InfoKeyDiv, InfoValueDivInline } from '../ProposalDetails';
import { Widget, WidgetRow, InfoWrapper, TitleText } from './SharedStyles';
import { formatDate } from 'utils/date';

const ResolveWidget: React.FC<any> = ({
  disabled,
  containerEventResolve,
  currentState,
  disputeId,
  onResolveProposal,
}) => {
  if (containerEventResolve) {
    return (
      <Widget>
        <WidgetRow>
          <TitleText>Resolve Details</TitleText>
        </WidgetRow>
        <InfoWrapper>
          <InfoKeyDiv>Resolved At</InfoKeyDiv>
          <InfoValueDivInline id="challenged-date__value">
            {formatDate(containerEventResolve.createdAt)}
          </InfoValueDivInline>
        </InfoWrapper>
        <InfoWrapper>
          <InfoKeyDiv>Approved</InfoKeyDiv>
          <InfoValueDivInline id="challenger__value">
            containerEventResolve.approved
          </InfoValueDivInline>
        </InfoWrapper>
      </Widget>
    );
  }

  if (currentState !== PROPOSAL_STATES.CHALLENGED) {
    return <></>;
  }

  return (
    <Widget>
      <div
        style={{
          fontFamily: 'Manrope',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '18px',
          color: '#7483B3',
        }}
      >
        <ANButton
          label="Resolve"
          disabled={disabled}
          height="45px"
          width="372px"
          style={{ margin: 'auto' }}
          onClick={() => onResolveProposal(disputeId)}
          buttonType="primary"
        />
      </div>
    </Widget>
  );
};

export default memo(ResolveWidget);
