import React, { useState, useEffect, useMemo, useContext } from 'react';
import { init as initApm, ApmBase } from '@elastic/apm-rum';
import { useWallet } from 'providers/AugmentedWallet';

const UseAPMContext = React.createContext({});

const APMProvider: React.FC = ({ children }) => {
  const context: any = useWallet();
  const { networkName } = context;

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

  useEffect(() => {
    if (apm && networkName) {
      const context = { networkType: networkName };
      apm.addLabels({ ...context });
      apm.setCustomContext(context);
    }
  }, [apm, networkName]);

  const contextValue = useMemo(() => {
    return { apm, setApm };
  }, [apm, setApm]);

  return <UseAPMContext.Provider value={contextValue}>{children}</UseAPMContext.Provider>;
};

function useAPM(): ApmBase {
  return useContext(UseAPMContext) as ApmBase;
}

export { APMProvider, useAPM };
