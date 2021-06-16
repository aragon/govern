import React, { useMemo, useState } from 'react';

import CreateDaoBasicInfo from './CreateDaoBasicInfo';
import CreateDaoConfig from './CreateDaoConfig';
import CreateDaoCollateral from './CreateDaoCollateral';
import CreateDaoReview from './CreateDaoReview';
import CreateDaoProgress from './CreateDaoProgress';
import { CreateDaoSteps } from './utils/Shared';
import { CreateDaoProvider } from './utils/CreateDaoContextProvider';

const CreateDao: React.FC = () => {
  const [activeStep, setActiveStep] = useState<CreateDaoSteps>(CreateDaoSteps.BasicInfo);

  const activeView = useMemo(() => {
    switch (activeStep) {
      case CreateDaoSteps.BasicInfo:
        return <CreateDaoBasicInfo setActiveStep={setActiveStep} />;

      case CreateDaoSteps.Config:
        return <CreateDaoConfig setActiveStep={setActiveStep} />;

      case CreateDaoSteps.Collateral:
        return <CreateDaoCollateral setActiveStep={setActiveStep} />;

      case CreateDaoSteps.Review:
        return <CreateDaoReview setActiveStep={setActiveStep} />;

      case CreateDaoSteps.Progress:
        return <CreateDaoProgress setActiveStep={setActiveStep} />;

      default:
        return <CreateDaoBasicInfo setActiveStep={setActiveStep} />;
    }
  }, [activeStep]);

  return <CreateDaoProvider>{activeView}</CreateDaoProvider>;
};

export default CreateDao;
