/* eslint-disable */
import React from 'react';
import { styled } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { CreateDaoStatus } from './CreateDao';
import SuccessDialog from 'components/Dialog/SuccessDialog';
import FailureDialog from 'components/Dialog/FailureDialog';

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

const Container = styled('div')({
  height: '80vh',
  justifyContent: 'center',
  display: 'flex',
  alignItems: 'center',
});

const CreateDaoResult: React.FC<ResultProps> = ({
  isSuccess,
  setCreateDaoStatus,
  postResultActionRoute,
}) => {
  const history = useHistory();

  const onClickSuccess = () => history.push('daos/' + postResultActionRoute);
  const onClickFailure = () => setCreateDaoStatus(CreateDaoStatus.PreCreate);

  return (
    <Container>
      {isSuccess ? (
        <SuccessDialog
          paperStyle
          title={'Your DAO is ready'}
          subTitle={
            'Congratulations. Your DAO is created and you can start interacting with it'
          }
          buttonLabel={'Get started'}
          onClick={onClickSuccess}
        />
      ) : (
        <FailureDialog
          paperStyle
          subTitle={
            'An error has occurred during the signature process. Do not worry, you can try again without losing your information.'
          }
          onClick={onClickFailure}
        ></FailureDialog>
      )}
    </Container>
  );
};

export default CreateDaoResult;
