import React, { useMemo, useContext } from 'react';
import { init as initApm, ApmBase } from '@elastic/apm-rum';

const UseAPMContext = React.createContext<ApmBase | null>(null);

const APMProvider: React.FC = ({ children }) => {
  let apm: ApmBase | null = null;
  if (process.env.REACT_APP_DEPLOYVERSION && process.env.REACT_APP_ENVIRONMENT) {
    apm = initApm({
      serviceName: 'govern',
      serverUrl: 'https://apm-monitoring.aragon.org',
      serviceVersion: process.env.REACT_APP_DEPLOYVERSION,
      environment: process.env.REACT_APP_ENVIRONMENT,
    });
  }

  const contextValue = useMemo(() => apm, [apm]);

  return <UseAPMContext.Provider value={contextValue}>{children}</UseAPMContext.Provider>;
};

function useAPM(): ApmBase {
  return useContext(UseAPMContext) as ApmBase;
}

export { APMProvider, useAPM };
