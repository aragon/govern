import React, { useMemo, useState, useEffect } from 'react';

import CreateDaoBasicInfo from './CreateDaoBasicInfo';
import CreateDaoConfig from './CreateDaoConfig';
import CreateDaoCollateral from './CreateDaoCollateral';
import CreateDaoReview from './CreateDaoReview';
import CreateDaoProgress from './CreateDaoProgress';
import { CreateDaoSteps } from './utils/Shared';
import { CreateDaoProvider } from './utils/CreateDaoContextProvider';
import PageContent from 'components/PageContent/PageContent';
import { PageName } from 'utils/HelpText';
import ReviewCard from './components/ReviewCard';

const CreateDao: React.FC = () => {
  const [activeStep, setActiveStep] = useState<CreateDaoSteps>(CreateDaoSteps.BasicInfo);

  useEffect(() => {
    // TODO: Sarkawt
    // When you move from previous step to second one, and if on the previos step, you had it scrolled, on the next step, it should scroll up
    // automatically. This should be working but it doesn't.
    window.scrollTo(0, 0);
  }, []);

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

  const getPageContent = (active: CreateDaoSteps) => {
    if (active !== CreateDaoSteps.Progress) {
      return (
        <PageContent
          pageName={PageName.CREATE_DAO}
          card={activeStep === CreateDaoSteps.Review && <ReviewCard />}
        >
          {activeView}
        </PageContent>
      );
    }
    return activeView;
  };

  return <CreateDaoProvider>{getPageContent(activeStep)}</CreateDaoProvider>;
};

export default CreateDao;
