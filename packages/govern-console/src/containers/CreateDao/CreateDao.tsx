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
import scrollToTop from '../../utils/scrollToId';

const CreateDao: React.FC = () => {
  const [activeStep, setActiveStep] = useState<CreateDaoSteps>(CreateDaoSteps.BasicInfo);

  // scroll to top on active form view change
  useEffect(() => {
    scrollToTop();
  }, [activeStep]);

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
