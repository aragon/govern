/* eslint-disable */
import React, { memo } from 'react';
import { ANButton } from 'components/Button/ANButton';
import { InputField } from 'components/InputFields/InputField';
import { PROPOSAL_STATES } from 'utils/states';
import { Link } from 'react-router-dom';
import { toUtf8String } from '@ethersproject/strings';

import {
  InfoKeyDiv,
  InfoValueDivInline,
  InfoValueDivBlock,
} from '../ProposalDetails';
import { Widget, WidgetRow, InfoWrapper, TitleText } from './SharedStyles';

import { formatDate} from 'utils/date';
import { getTruncatedAccountAddress } from 'utils/account'
import { getIpfsCid, getIpfsURI } from 'utils/ipfs'

const ChallengeWidget: React.FC<any> = ({
  containerEventChallenge,
  currentState,
  setChallengeReason,
  onChallengeProposal,
}) => {
  const [isExpanded, updateIsExpanded] = React.useState<boolean>(false);

  if (containerEventChallenge) {
    const challengeReasonCid = getIpfsCid(containerEventChallenge.reason)
    return (
      <Widget>
        <WidgetRow>
          <TitleText>Challenge Details</TitleText>
        </WidgetRow>
        <InfoWrapper>
          <InfoKeyDiv>Challenged At</InfoKeyDiv>
          <InfoValueDivInline id="challenged-date__value">
            {formatDate(containerEventChallenge.createdAt)}
          </InfoValueDivInline>
        </InfoWrapper>
        <InfoWrapper>
          <InfoKeyDiv>Challenger</InfoKeyDiv>
          <InfoValueDivInline id="challenger__value">
            {getTruncatedAccountAddress(containerEventChallenge.challenger)}
          </InfoValueDivInline>
        </InfoWrapper>
        <InfoKeyDiv>Challenge Reason</InfoKeyDiv>
        <InfoValueDivBlock
          maxlines={isExpanded ? undefined : 4}
          style={{
            padding: 0,
            WebkitBoxOrient: 'vertical',
            display: '-webkit-box',
            marginTop: 0,
          }}
        >       
          { 
            challengeReasonCid
            ?
              <Link
                  to={getIpfsURI(challengeReasonCid)}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  View file
              </Link>
            : 
            toUtf8String(containerEventChallenge.reason)
          }    
        </InfoValueDivBlock>
      </Widget>
    );
  }

  if (currentState !== PROPOSAL_STATES.SCHEDULED) {
    return <></>;
  }

  return (
    <Widget>
      <WidgetRow
        style={{
          fontSize: '18px',
          color: '#7483B3',
        }}
        marginBottom="9px"
      >
        Challenge Reason
      </WidgetRow>
      <WidgetRow marginBottom="9px">
        <InputField
          onInputChange={(value) => {
            setChallengeReason(value);
          }}
          label={''}
          placeholder={''}
          height={'46px'}
          width={'372px'}
        />
      </WidgetRow>
      <WidgetRow marginBottom="9px">
        <ANButton
          buttonType="primary"
          label="Challenge"
          height="45px"
          width="372px"
          style={{ margin: 'auto' }}
          onClick={() => onChallengeProposal()}
        />
      </WidgetRow>
    </Widget>
  );
};

export default memo(ChallengeWidget);
