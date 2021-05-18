import React, { useState, ChangeEvent, createRef } from 'react';
import { styled } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { HelpButton } from 'components/HelpButton/HelpButton';
import MUICard from '@material-ui/core/Card';
import { useForm, Controller } from 'react-hook-form';
import { BlueSwitch } from 'components/Switchs/BlueSwitch';
import { InputField } from 'components/InputFields/InputField';
import { ANButton } from 'components/Button/ANButton';
import {
  ANCircularProgressWithCaption,
  ANProgressCationPropos,
} from '../CircularProgress/ANCircularProgressWithCaption';
import { CiruclarProgressStatus } from 'utils/types';

export interface ChallengeCardInputs {
  isFile: boolean;
  challengeReason: string;
  challengeFile: File;
}

export interface ChallengeCardProps {
  setIpfsHash: (hash: string) => void;
  challengeButtonFunction: () => void;
}

const ChallengeCardWrapper = styled(MUICard)(({ theme }) => ({
  background: theme.custom.daoCard.background,
  height: 'auto',
  border: `2px ${theme.custom.daoCard.border}`,
  boxSizing: 'border-box',
  boxShadow: '0px 6px 6px rgba(180, 193, 228, 0.35)',
  padding: '28px',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
}));

const Title = styled(Typography)({
  fontFamily: 'Manrope',
  fontSize: '18px',
  fontWeight: 'normal',
  lineHeight: '15px',
  letterSpacing: '0em',
  textAlign: 'left',
  color: '#7483B2',
});

const TitleContainer = styled('div')({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  gap: '10px',
  justifyContent: 'flex-start',
});

const Row = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyItems: 'flex-star',
  gap: '14px',
  marginTop: '15px',
});

const OptionText = styled('div')({
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '18px',
  lineHeight: '24.84px',
});

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  setIpfsHash,
  challengeButtonFunction,
}) => {
  const { control, handleSubmit, watch, setValue } = useForm<ChallengeCardInputs>();
  const uploadCreatedRef: React.RefObject<HTMLInputElement> = createRef();
  const [uploadState, setUploadState] = useState<CiruclarProgressStatus>(
    CiruclarProgressStatus.Disabled,
  );

  // currently: the idea is for this component to upload to ipfs and give back the hash
  // once the hash is recieved by the parent it can set challenge function
  // and to be set to this child for challenge button
  //
  // another: child component should only handle visual task, i would prefare that this component
  // should return the file to parent so that parent can use this file,
  // then slight modification should be done for this child component so that the parent can update it's progress
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) setValue('challengeFile', event.target.files[0]);
    // update progress
    setUploadState(CiruclarProgressStatus.InProgress);

    // TODO: upload logic - handle result & setIpfsHash
    setIpfsHash('0xsomehash');
  };

  return (
    <ChallengeCardWrapper>
      <TitleContainer>
        <Title>Challenge reason</Title>{' '}
        <HelpButton helpText={'Provide your reasons for the challenge'} />
      </TitleContainer>
      <Row>
        <OptionText>{'Text'}</OptionText>
        <div style={{ marginTop: '-12px' }}>
          <Controller
            name="isFile"
            control={control}
            defaultValue={false}
            render={({ field: { onChange, value } }) => (
              <BlueSwitch onChange={onChange} value={value} />
            )}
          />
        </div>
        <OptionText>{'File'}</OptionText>
      </Row>
      <Title>{!watch('isFile') ? 'Provide challenge reason' : 'Provide challenge file'}</Title>

      {!watch('isFile') ? (
        <Controller
          name="challengeReason"
          control={control}
          defaultValue=""
          shouldUnregister={!watch('isFile')}
          rules={{ required: 'This is required.' }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputField
              label={''}
              onInputChange={onChange}
              height={'85px'}
              placeholder={'Challenge body...'}
              value={value}
              error={!!error}
              helperText={error ? error.message : null}
              style={{ marginTop: '10px' }}
            />
          )}
        />
      ) : (
        <>
          <Row>
            <Controller
              name="challengeFile"
              control={control}
              defaultValue=""
              shouldUnregister={watch('isFile')}
              rules={{ required: 'This is required.' }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <InputField
                  label={''}
                  onInputChange={onChange}
                  height={'46px'}
                  placeholder={'Your file...'}
                  value={value.name}
                  error={!!error}
                  helperText={error ? error.message : null}
                  disabled
                  fullWidth
                />
              )}
            />
            <input
              type={'file'}
              ref={uploadCreatedRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <ANButton
              width={'115px'}
              disabled={false}
              label="browse"
              buttonType="secondary"
              labelColor={'#00C2FF'}
              onClick={() =>
                uploadCreatedRef && uploadCreatedRef.current
                  ? uploadCreatedRef.current.click()
                  : null
              }
            />
          </Row>
          {uploadState !== CiruclarProgressStatus.Disabled ? (
            <ANCircularProgressWithCaption
              state={uploadState}
              caption={
                uploadState === CiruclarProgressStatus.Done
                  ? watch('challengeFile').name
                  : 'Uploading file to IPFS'
              }
            />
          ) : null}
        </>
      )}

      <ANButton
        width={'100%'}
        disabled={
          uploadState === CiruclarProgressStatus.InProgress && watch('isFile') ? true : false
        }
        label="Challenge"
        buttonType="primary"
        style={{ marginTop: '14px' }}
        onClick={handleSubmit((data) => {
          // TODO remove this console log
          console.log(data);
          challengeButtonFunction();
        })}
      />
    </ChallengeCardWrapper>
  );
};
