/* eslint-disable */
import React, { memo } from 'react';
import { ANButton } from 'components/Button/ANButton';
import { PROPOSAL_STATES } from 'utils/states';
import {
  InfoKeyDiv,
  InfoValueDivInline,
  InfoValueDivBlock,
} from '../ProposalDetails';
import { Widget, WidgetRow, InfoWrapper, TitleText } from './SharedStyles';
import {
  getFormattedDate,
} from 'utils/date';
import { getTruncatedAccountAddress } from 'utils/account'

const ResolveWidget: React.FC<any> = ({
  containerEventResolve,
  currentState,
  onResolveProposal,
}) => {
  if (containerEventResolve) {
    return (
      <Widget>
        <WidgetRow>
          <TitleText>Challenge Details</TitleText>
        </WidgetRow>
        <InfoWrapper>
          <InfoKeyDiv>Resolved At</InfoKeyDiv>
          <InfoValueDivInline id="challenged-date__value">
            {getFormattedDate(containerEventResolve.createdAt)}
          </InfoValueDivInline>
        </InfoWrapper>
        <InfoWrapper>
          <InfoKeyDiv>Approved</InfoKeyDiv>
          <InfoValueDivInline id="challenger__value">
            {getTruncatedAccountAddress(containerEventResolve.approved)}
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
          height="45px"
          width="372px"
          style={{ margin: 'auto' }}
          onClick={onResolveProposal}
          buttonType="primary"
        />
      </div>
    </Widget>
  );

  return <p></p>;
};

export default memo(ResolveWidget);
