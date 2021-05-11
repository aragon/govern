/* eslint-disable */
import React, { memo, useEffect, useMemo, useState } from 'react';
import { ANButton } from 'components/Button/ANButton';
import { PROPOSAL_STATES } from 'utils/states';
import { formatDate } from 'utils/date';
import { InfoKeyDiv, InfoValueDivInline } from '../ProposalDetails';
import { Widget, WidgetRow, InfoWrapper, TitleText } from './SharedStyles';

const ExecuteWidget: React.FC<any> = ({
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

  const postponeTime = (time: number) => {
    return time * 1000 
    // return time * 1000 + 15000 // block.timestamp latency
  }

  const isEligibleToBeExecuted = () => {
    return Date.now()  >= postponeTime(executionTime)
  };

  return (
    <>
      <Widget>
        {isEligibleToBeExecuted() ? (
          <>
            <WidgetRow marginBottom="9px">
              <ANButton
                buttonType="primary"
                label="Execute"
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
              <InfoValueDivInline>
                {formatDate(executionTime)}
              </InfoValueDivInline>
            </InfoWrapper>
          </WidgetRow>
        )}
      </Widget>
    </>
  );
  
};

export default memo(ExecuteWidget);
