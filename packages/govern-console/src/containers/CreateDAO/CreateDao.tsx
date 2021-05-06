/* eslint-disable */
import React, { useState, memo } from 'react';
import { useHistory } from 'react-router-dom';
import { CiruclarProgressStatus } from '../../utils/types';
import CreateDaoProgress, { CreateDaoProgressProps } from './CreateDaoProgress'
import CreateDaoResult from './CreateDaoResult'
import CreateDaoForm from './CreateDaoForm'

export enum CreateDaoStatus {
  PreCreate,
  InProgress,
  Successful,
  Failed,
}

const CreateDao: React.FC = () => {
  const history = useHistory();
  const [createdDaoRoute, setCreatedDaoRoute] = useState<string>('#');
  const [createDaoStatus, setCreateDaoStatus] = useState<CreateDaoStatus>(
    CreateDaoStatus.PreCreate,
  );
  const onClickBackFromCreateDaoPage = () => {
    history.goBack();
  };
  const [progress, setProgress] = useState<CreateDaoProgressProps>({
    isTokenRegister: true,
    progressStatus: { 
      create: CiruclarProgressStatus.InProgress,
      register: CiruclarProgressStatus.Disabled
    },
  });

  switch (createDaoStatus) {
    case CreateDaoStatus.PreCreate: {
      return (
        <CreateDaoForm
          setProgress={setProgress}
          setCreateDaoStatus={setCreateDaoStatus}
          setCreatedDaoRoute={setCreatedDaoRoute}
          cancelForm={onClickBackFromCreateDaoPage}
        />
      );
    }
    case CreateDaoStatus.InProgress: {
      return (
        <CreateDaoProgress
          progressStatus={progress.progressStatus}
          isTokenRegister={progress.isTokenRegister}
        />
      );
    }
    case CreateDaoStatus.Successful: {
      return (
        <CreateDaoResult
          isSuccess={true}
          setCreateDaoStatus={setCreateDaoStatus}
          postResultActionRoute={createdDaoRoute}
        />
      );
    }
    case CreateDaoStatus.Failed: {
      return (
        <CreateDaoResult
          isSuccess={false}
          setCreateDaoStatus={setCreateDaoStatus}
          postResultActionRoute={'#'}
        />
      );
    }
    default: {
      return (
        <CreateDaoForm
          setProgress={setProgress}
          setCreateDaoStatus={setCreateDaoStatus}
          setCreatedDaoRoute={setCreatedDaoRoute}
          cancelForm={onClickBackFromCreateDaoPage}
        />
      );
    }
  }
};

export default memo(CreateDao);
