import React, { memo } from 'react';
import { ANButton } from 'components/Button/ANButton';
import { PROPOSAL_STATES } from 'utils/states';
import { formatDate } from 'utils/date';
import { InfoKeyDiv, InfoValueDivInline } from '../ProposalDetails';
import { Widget, WidgetRow, InfoWrapper, TitleText } from './SharedStyles';
import { eligibleExecution } from 'utils/states';
import { Box, Button } from '@aragon/ui';

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
  const { isEligible, eligibleDate } = eligibleExecution(executionTime);

  return (
    <>
      <Box shadow>
        {isEligible ? (
          <>
            <WidgetRow marginBottom="9px">
              <Button
                wide
                type="primary"
                disabled={disabled}
                size="large"
                label="Execute"
                style={{ margin: 'auto' }}
                onClick={() => onExecuteProposal()}
              />
            </WidgetRow>
          </>
        ) : (
          <WidgetRow>
            <InfoWrapper>
              <InfoKeyDiv>Execute available at</InfoKeyDiv>
              <InfoValueDivInline>{eligibleDate}</InfoValueDivInline>
            </InfoWrapper>
          </WidgetRow>
        )}
      </Box>
    </>
  );
};

export default memo(ExecuteWidget);
