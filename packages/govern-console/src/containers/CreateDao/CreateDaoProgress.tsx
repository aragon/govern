import React, { ReactNode, useEffect, useState } from 'react';
import progressImage from '../../images/svgs/CreateDaoInProgress.svg';
import { CreateDaoSteps } from './Shared';
// import { useCreateDao } from './CreateDaoContextProvider';
import ProgressComponent from './ProgressComponent';
import { CiruclarProgressStatus } from 'utils/types';
import { Button, StyledText, useTheme, SPACING, useLayout } from '@aragon/ui';

const CreateDaoProgress: React.FC<{
  setActiveStep: React.Dispatch<React.SetStateAction<CreateDaoSteps>>;
}> = () => {
  const { layoutName } = useLayout();
  const theme = useTheme();
  //   const { basicInfo, config, collaterals } = useCreateDao();
  const [progressList, setProgressList] = useState([
    { status: CiruclarProgressStatus.InProgress, text: 'Creating DAO' },
  ]);
  const [action, setAction] = useState<ReactNode | null>(null);

  ///////////////////////// test code start
  // create dao calls and register token could be implemented here
  const registerSuccessAction = (
    <Button
      size={'large'}
      mode={'primary'}
      style={{ marginTop: 20, marginLeft: layoutName !== 'small' ? SPACING[layoutName] : '0px' }}
      onClick={() => {
        console.log('go to dao page');
      }}
    >
      Amazing, all ready. Let’s start
    </Button>
  );

  const registerToken = () => {
    const newList = [...progressList];
    newList.push({
      status: CiruclarProgressStatus.InProgress,
      text: 'Register token in Aragon Voice',
    });
    setProgressList(newList);
    setAction(null);

    // if register successfull
    setTimeout(() => {
      newList[1].status = CiruclarProgressStatus.Done;
      setProgressList(newList);
      setAction(registerSuccessAction);
    }, 5 * 1000);
  };

  const CreateDaoSuccessAction = (
    <div>
      <StyledText name={'body2'}>
        Your DAO is ready. Do you wanna register your token in Aragon Voice?
      </StyledText>
      <StyledText name={'body2'} style={{ color: theme.disabled }}>
        This allows you create governance proposals easy with 0 gass price
      </StyledText>
      <Button size={'large'} mode={'secondary'} style={{ marginTop: 20 }}>
        Don't register token
      </Button>
      <Button
        size={'large'}
        mode={'primary'}
        style={{ marginTop: 20, marginLeft: layoutName !== 'small' ? SPACING[layoutName] : '0px' }}
        onClick={registerToken}
      >
        Yes, register token
      </Button>
    </div>
  );

  // start creating dao
  /*eslint-disable */
  useEffect(() => {
    console.log('start creating doa');
    // console.log('DATA:', basicInfo, config, collaterals);
    const callCreateDao = async () => {
      // test code: To be remove
      if (progressList.length === 1) {
        const newList = [...progressList];
        newList[0].status = CiruclarProgressStatus.Done;
        setTimeout(() => {
          setProgressList(newList);
          setAction(CreateDaoSuccessAction);
        }, 5 * 1000);
      }
    };
    callCreateDao();
  }, []);
  /*eslint-disable */
  ///////////////////////// test code end

  return (
    <ProgressComponent
      image={progressImage}
      title={'Creating your DAO'}
      subTitle={'Hold tight your transaction is under process'}
      progressList={progressList}
      info={'Please be patient and do not close this window until it finishes.'}
      action={action}
    />
  );
};

export default CreateDaoProgress;
