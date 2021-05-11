/* eslint-disable */
import React, { useEffect } from 'react';
import CreateDaoInProgressImage from '../../images/svgs/CreateDaoInProgress.svg';
import { ANCircularProgressWithCaption } from 'components/CircularProgress/ANCircularProgressWithCaption';
import { ANWrappedPaper } from 'components/WrapperPaper/ANWrapperPaper';
import { styled } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { CiruclarProgressStatus } from '../../utils/types';

export interface CreateDaoProgressProps {
  /**
   * Show token register progress
   */
  isTokenRegister?: boolean;
  /**
   * Status of progress
   */
  progressStatus: {
    create: CiruclarProgressStatus;
    register?: CiruclarProgressStatus;
  };
}

const Container = styled('div')({
  height: '80vh',
  justifyContent: 'center',
  display: 'flex',
  alignItems: 'center',
});

const Title = styled(Typography)({
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: 28,
  lineHeight: '38px',
  color: '#20232C',
  marginTop: 17,
  height: 50,
  display: 'flex',
  justifyContent: 'center',
});

const SubTitle = styled(Typography)({
  width: '365px',
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: 18,
  lineHeight: '25px',
  color: '#7483AB',
  display: 'flex',
  justifyContent: 'center',
  textAlign: 'center',
  margin: '0px 50px 0px 50px',
});

const ProgressContainer = styled('div')({
  justifyContent: 'center',
  display: 'flex',
  marginTop: '10px',
  flexDirection: 'column',
  alignItems: 'center',
});

const BottomMessage = styled('div')({
  borderRadius: '10px',
  background: '#ECFAFF',
  width: '446px',
  height: '51px',
  lineHeight: '51px',
  textAlign: 'center',
  marginTop: '40px',
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: 14,
  color: '#0176FF',
});

const ProgressImage = styled('img')({
  maxWidth: '285px',
  minWidth: '121px',
  marginLeft: 'auto',
  marginRight: 'auto',
});

const CreateDaoProgress: React.FC<CreateDaoProgressProps> = ({
  isTokenRegister,
  progressStatus,
}) => {
  return (
    <Container>
      <ANWrappedPaper>
        <ProgressImage src={CreateDaoInProgressImage} />
        <Title>Creating your DAO</Title>
        <div
          style={{
            justifyContent: 'center',
            display: 'flex',
          }}
        >
          <SubTitle>Hold tight your transaction is under process</SubTitle>
        </div>
        <ProgressContainer>
          <ANCircularProgressWithCaption
            caption={'Creating DAO'}
            state={progressStatus.create}
          />
          {isTokenRegister ? (
            <ANCircularProgressWithCaption
              caption={'Registering token'}
              state={progressStatus.register ?? 0}
            />
          ) : null}
        </ProgressContainer>
        <BottomMessage>
          Please be patient and do not close this window until it finishes.
        </BottomMessage>
      </ANWrappedPaper>
    </Container>
  );
};

export default CreateDaoProgress;
