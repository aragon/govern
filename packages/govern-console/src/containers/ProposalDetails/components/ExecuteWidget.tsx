/* eslint-disable */
import React, { memo, useEffect, useMemo, useState } from 'react';
import { ANButton } from 'components/Button/ANButton';
import { InputField } from 'components/InputFields/InputField';
import { PROPOSAL_STATES } from 'utils/states';
import { getFormattedDate } from 'utils/HelperFunctions';
import Field from 'components/Field/Field';
import {
  InfoKeyDiv,
  InfoValueDivInline,
  InfoValueDivBlock,
} from '../ProposalDetails';
import { Widget, WidgetRow, InfoWrapper, TitleText } from './SharedStyles';

const isEligibleToBeExecuted = (executionTime: number) => {
  // 15 seconds latency due to block.timestamp sometimes 15 seconds wrong.
  return Date.now() - executionTime * 1000 >= 15000;
};

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
            {getFormattedDate(containerEventExecute.createdAt)}
          </InfoValueDivInline>
        </InfoWrapper>
        <InfoKeyDiv>ExecuteResults</InfoKeyDiv>
        <InfoValueDivBlock
          id="executed__value"
          maxlines={4}
          style={{
            padding: 0,
            WebkitBoxOrient: 'vertical', //added as inline styling because makeStyles does not wupport webkit orientation needed for line clamp propoerty.
            display: '-webkit-box',
            marginTop: 0,
          }}
        >
          <Field value={containerEventExecute.execResults} inline={false} />
        </InfoValueDivBlock>
      </Widget>
    );
  }

  if (currentState !== PROPOSAL_STATES.SCHEDULED) {
    return <></>;
  }

  return (
    <>
      <Widget>
        {isEligibleToBeExecuted(executionTime) ? (
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
                {getFormattedDate(executionTime)}
              </InfoValueDivInline>
            </InfoWrapper>
          </WidgetRow>
        )}
      </Widget>
    </>
  );

  return <p></p>;
};

export default memo(ExecuteWidget);
