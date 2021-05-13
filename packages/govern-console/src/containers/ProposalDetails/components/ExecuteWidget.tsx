import React, { memo, useEffect, useMemo, useState } from 'react';
import { ANButton } from 'components/Button/ANButton';
import { PROPOSAL_STATES } from 'utils/states';
import { formatDate } from 'utils/date';
import { InfoKeyDiv, InfoValueDivInline } from '../ProposalDetails';
import { Widget, WidgetRow, InfoWrapper, TitleText } from './SharedStyles';
import { isEligibleForExecution } from 'utils/states';

const ExecuteWidget: React.FC<any> = ({
  disabled,
  containerEventExecute,
  currentState,
  executionTime,
  onExecuteProposal,
}) => {
  if (containerEventExecute) {
    return (
      <Widget>
        <WidgetRow>
          <TitleText>Executed</TitleText>
        </WidgetRow>
        <InfoWrapper>
          <InfoKeyDiv>Executed At</InfoKeyDiv>
          <InfoValueDivInline id="executed-date__value">
            {formatDate(containerEventExecute.createdAt)}
          </InfoValueDivInline>
        </InfoWrapper>
      </Widget>
    );
  }

  if (currentState !== PROPOSAL_STATES.SCHEDULED) {
    return <></>;
  }

  return (
    <>
      <Widget>
        {isEligibleForExecution(executionTime) ? (
          <>
            <WidgetRow marginBottom="9px">
              <ANButton
                buttonType="primary"
                label="Execute"
                disabled={disabled}
                height="45px"
                width="372px"
                style={{ margin: 'auto' }}
                onClick={() => onExecuteProposal()}
              />
            </WidgetRow>
          </>
        ) : (
          <WidgetRow>
            <InfoWrapper>
              <InfoKeyDiv>Execute available at</InfoKeyDiv>
              <InfoValueDivInline>{formatDate(executionTime)}</InfoValueDivInline>
            </InfoWrapper>
          </WidgetRow>
        )}
      </Widget>
    </>
  );
};

export default memo(ExecuteWidget);
