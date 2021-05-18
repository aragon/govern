/* eslint-disable */
import React, { memo, useState } from 'react';
import { ANButton } from 'components/Button/ANButton';
import { InputField } from 'components/InputFields/InputField';
import { PROPOSAL_STATES } from 'utils/states';
import { Link } from 'react-router-dom';
import { toUTF8String } from 'utils/lib';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { HelpButton } from 'components/HelpButton/HelpButton';

import {
  InfoKeyDiv,
  InfoValueDivInline,
  InfoValueDivBlock,
} from '../ProposalDetails';
import { Widget, WidgetRow, InfoWrapper, TitleText } from './SharedStyles';
import { IPFSInput } from 'components/Field/IPFSInput';

import { formatDate } from 'utils/date';
import { getTruncatedAccountAddress } from 'utils/account';
import { getIpfsUrl } from 'utils/ipfs';

import { styled } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

interface FormInputs {
  reason: string;
  isReasonFile: boolean;
  reasonFile: any;
}

// TODO: GIORGI repeating styles
export const InputSubTitle = styled(Typography)({
  width: 'fit-content',
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: 18,
  lineHeight: '25px',
  color: '#7483AB',
  marginTop: '17px',
  marginBottom: '17px',
});


const ChallengeWidget: React.FC<any> = ({
  disabled,
  containerEventChallenge,
  currentState,
  setChallengeReason,
  setChallengeFile,
  onChallengeProposal,
}) => {
  const [isExpanded, updateIsExpanded] = React.useState<boolean>(false);

  if (containerEventChallenge) {
    const challengeReasonIpfsUrl = getIpfsUrl(containerEventChallenge.reason);
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
          {challengeReasonIpfsUrl ? (
            <Link
              to={challengeReasonIpfsUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              View file
            </Link>
          ) : (
            toUTF8String(containerEventChallenge.reason) ||
            `Reason can't be decoded: ${containerEventChallenge.reason}`
          )}
        </InfoValueDivBlock>
      </Widget>
    );
  }

  if (currentState !== PROPOSAL_STATES.SCHEDULED) {
    return <></>;
  }

  const methods = useForm<FormInputs>();
  const {
    register,
    control,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = methods;

  const [reasonFile, setReasonFile] = useState<any>(null);

  return (
    <Widget>
      {/* <WidgetRow
        style={{
          fontSize: '18px',
          color: '#7483B3',
        }}
        marginBottom="9px"
      >
        Challenge Reason
      </WidgetRow> */}
      <InputSubTitle>
        Challenge Reason{' '}
        <HelpButton
          helpText={
            'The amount of time any action will be delayed before it can be executed. During this time anyone can challenge it, preventing its execution'
          }
        />
      </InputSubTitle>

      <FormProvider {...methods}>
        <IPFSInput
          label="Enter the justification for changes"
          placeholder="Justification Reason..."
          isFile="isReasonFile"
          textInputName="reason"
          fileInputName="reasonFile"
          updateFile={setReasonFile}
        />
        <WidgetRow marginBottom="9px">
          <ANButton
            buttonType="primary"
            label="Challenge"
            disabled={disabled}
            height="45px"
            width="372px"
            style={{ margin: 'auto', marginTop: '10px' }}
            onClick={() => onChallengeProposal(
              getValues('reason'),
              getValues('reasonFile')
            )}
          />
        </WidgetRow>
      </FormProvider>
    </Widget>
  );
};

export default memo(ChallengeWidget);
