/* eslint-disable */
import React, { memo, useState, useEffect, useCallback } from 'react';
import { ANButton } from 'components/Button/ANButton';
import { InputField } from 'components/InputFields/InputField';
import { PROPOSAL_STATES } from 'utils/states';
import { Link } from 'react-router-dom';
import { toUTF8String } from 'utils/lib';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { HelpButton } from 'components/HelpButton/HelpButton';

import { InfoKeyDiv, InfoValueDivInline, InfoValueDivBlock } from '../ProposalDetails';
import { Widget, WidgetRow, InfoWrapper, TitleText } from './SharedStyles';
import { IPFSInput } from 'components/Field/IPFSInput';
import { IPFSField } from 'components/Field/IPFSField';
import { formatDate } from 'utils/date';
import { getTruncatedAccountAddress } from 'utils/account';
import { getIpfsUrl, fetchIPFS } from 'utils/ipfs';
import { ipfsMetadata } from 'utils/types';

import { styled } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { Box, Button } from '@aragon/ui';

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
  onChallengeProposal,
}) => {
  const [reason, setReason] = useState<ipfsMetadata & string>();
  const [loading, setLoading] = useState<boolean>(true);

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

  const submit = useCallback(() => {
    onChallengeProposal(getValues('reason'), getValues('reasonFile'));
  }, []);

  useEffect(() => {
    async function getReason() {
      const data = await fetchIPFS(containerEventChallenge.reason);
      const reason = data || containerEventChallenge.reason;
      setLoading(false);
      setReason(reason);
    }
    if (containerEventChallenge) {
      getReason();
    }
  }, [containerEventChallenge]);

  if (containerEventChallenge) {
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
          maxlines={4}
          style={{
            padding: 0,
            WebkitBoxOrient: 'vertical',
            display: '-webkit-box',
            marginTop: 0,
          }}
        >
          <IPFSField value={reason} loading={loading} />
        </InfoValueDivBlock>
      </Widget>
    );
  }

  if (currentState !== PROPOSAL_STATES.SCHEDULED) {
    return <></>;
  }

  return (
    <Box shadow>
      {/* <InputSubTitle>
        Challenge Reason{' '}
        <HelpButton
          helpText={
            'Provide your reasons for challenging this transaction. Be as detailed as possible so Court guardians can make an informed decision.'
          }
        />
      </InputSubTitle> */}

      <FormProvider {...methods}>
        <IPFSInput
          title="Challenge Reason"
          subtitle="Provide your reasons for challenging this transaction. Be as detailed as possible so Court guardians can make an informed decision."
          label="Provide Reason"
          placeholder="Reasons for challenging the transaction..."
          textInputName="reason"
          fileInputName="reasonFile"
        />
        <Button
          wide
          type="primary"
          label="Challenge"
          disabled={disabled}
          size="large"
          style={{ marginTop: '10px' }}
          onClick={handleSubmit(submit)}
        />
      </FormProvider>
    </Box>
  );
};

export default memo(ChallengeWidget);
