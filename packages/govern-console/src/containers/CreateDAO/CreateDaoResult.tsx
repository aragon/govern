import React from 'react';
import { ANButton } from 'components/Button/ANButton';
import { styled } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import GreenTickImage from '../../images/svgs/green_tick.svg';
import CrossImage from '../../images/svgs/cross.svg';
import { ANWrappedPaper } from 'components/WrapperPaper/ANWrapperPaper';
import { CreateDaoStatus } from './CreateDao';

export interface ResultProps {
  /**
        success or failed result
     */
  isSuccess: boolean;

  /**
        change/update creating dao status
     */
  setCreateDaoStatus(status: CreateDaoStatus): void;

  /*
          value to be passed to progress bar: range 0-100
      */
  postResultActionRoute: string;
}

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

const Container = styled('div')({
  height: '80vh',
  justifyContent: 'center',
  display: 'flex',
  alignItems: 'center',
});

const ResultImage = styled('img')({
  width: '88px',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: '88px',
});

const CreateDaoResult: React.FC<ResultProps> = ({
  isSuccess,
  setCreateDaoStatus,
  postResultActionRoute,
}) => {
  const history = useHistory();
  return (
    <Container>
      <ANWrappedPaper>
        <ResultImage src={isSuccess ? GreenTickImage : CrossImage} />
        <Title>{isSuccess ? 'Your DAO is ready' : 'Somthing went wrong'}</Title>
        <SubTitle>
          {isSuccess
            ? 'Congratulations. Your DAO is created and you can start interacting with it'
            : 'An error has occurred during the signature process. Do not worry, you can try again without losing your information.'}
        </SubTitle>
        <div
          style={{
            justifyContent: 'center',
            display: 'flex',
          }}
        >
          <ANButton
            width={'446px'}
            label={isSuccess ? 'Get started' : 'Ok, let’s try again'}
            buttonType="primary"
            style={{ marginTop: 40 }}
            onClick={async () => {
              if (isSuccess) {
                history.push('daos/' + postResultActionRoute);
              } else {
                setCreateDaoStatus(CreateDaoStatus.PreCreate);
              }
            }}
          />
        </div>
      </ANWrappedPaper>
    </Container>
  );
};

export default CreateDaoResult;
