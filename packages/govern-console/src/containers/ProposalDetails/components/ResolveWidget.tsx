import React, { memo } from 'react';
import { PROPOSAL_STATES } from 'utils/states';
import { InfoKeyDiv, InfoValueDivInline } from '../ProposalDetails';
import { Widget, WidgetRow, InfoWrapper, TitleText } from './SharedStyles';
import { formatDate } from 'utils/date';
import { useDisputeHook } from 'hooks/court-hooks';
import { Button } from '@aragon/ui';
import { networkEnvironment } from 'environment';

const { courtUrl } = networkEnvironment;

const ResolveWidget: React.FC<any> = ({
  disabled,
  containerEventResolve,
  currentState,
  resolver,
  disputeId,
  onResolveProposal,
}) => {
  const { data, isDefaultCourt } = useDisputeHook(disputeId, resolver);

  if (containerEventResolve) {
    return (
      <Widget>
        <WidgetRow>
          <TitleText>Dispute resolution details</TitleText>
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
            {String(containerEventResolve.approved)}
          </InfoValueDivInline>
        </InfoWrapper>
      </Widget>
    );
  }

  if (currentState !== PROPOSAL_STATES.CHALLENGED) {
    return <></>;
  }

  if (typeof data === 'undefined' && isDefaultCourt) {
    return <></>;
  }

  if (data && data.disputes.length > 0 && data.disputes[0].finalRuling == 0 && isDefaultCourt) {
    // ruling hasn't been executed yet.
    return (
      <Widget>
        <WidgetRow>
          <TitleText>Track the status of the dispute</TitleText>
        </WidgetRow>
        <WidgetRow>
          <a href={`${courtUrl}/disputes/${disputeId}`} target="_blank" rel="noopener noreferrer">
            Click
          </a>
        </WidgetRow>
      </Widget>
    );
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
        <Button
          wide
          label="Resolve dispute"
          disabled={disabled}
          mode="primary"
          size="large"
          style={{ margin: 'auto' }}
          onClick={() => onResolveProposal(disputeId)}
        />
      </div>
    </Widget>
  );
};

export default memo(ResolveWidget);
