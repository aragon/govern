import React, { useState, useMemo, useContext } from 'react';
import { init as initApm, ApmBase } from '@elastic/apm-rum';

interface IAPMContext {
  apm: ApmBase | null;
  setApm: React.Dispatch<React.SetStateAction<ApmBase | null>> | null;
}
const UseAPMContext = React.createContext<IAPMContext>({ apm: null, setApm: null });

const APMProvider: React.FC = ({ children }) => {
  const [apm, setApm] = useState<ApmBase | null>(() => {
    if (process.env.REACT_APP_DEPLOY_VERSION && process.env.REACT_APP_DEPLOY_ENVIRONMENT) {
      return initApm({
        serviceName: 'govern',
        serverUrl: 'https://apm-monitoring.aragon.org',
        serviceVersion: process.env.REACT_APP_DEPLOY_VERSION,
        environment: process.env.REACT_APP_DEPLOY_ENVIRONMENT,
      });
    } else {
      console.warn('REACT_APP_DEPLOY_VERSION or REACT_APP_DEPLOY_ENVIRONMENT is not provided.');
      return null;
    }
  });

  const contextValue = useMemo(() => {
    return { apm, setApm };
  }, [apm, setApm]);

  return <UseAPMContext.Provider value={contextValue}>{children}</UseAPMContext.Provider>;
};

function useAPM() {
  return useContext(UseAPMContext);
}

function updateAPMContext(apm: ApmBase | null, networkType: string) {
  if (apm && networkType) {
    const context = { networkType: networkType };
    apm.addLabels(context);
    apm.setCustomContext(context);
  }
}

export { APMProvider, useAPM, updateAPMContext };
