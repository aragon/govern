import React, { useState, useEffect, useMemo, useContext } from 'react';
import { init as initApm, ApmBase, AgentConfigOptions } from '@elastic/apm-rum';
import { useWallet } from 'providers/AugmentedWallet';

const UseAPMContext = React.createContext<ApmBase | null>(null);

const APMProvider: React.FC = ({ children }) => {
  const context: any = useWallet();
  const { networkName } = context;

  const [apm, setApm] = useState<ApmBase | null>(null);

  useEffect(() => {
    const config: AgentConfigOptions = {
      serviceName: 'govern',
      serverUrl: 'https://apm-monitoring.aragon.org',
      serviceVersion: process.env.REACT_APP_DEPLOYVERSION,
      environment: networkName,
    };
    if (process.env.REACT_APP_DEPLOYVERSION) {
      setApm(initApm(config));
    } else {
      console.warn('REACT_APP_DEPLOYVERSION is not provided.');
    }
  }, [networkName]);

  const contextValue = useMemo(() => apm, [apm]);

  return <UseAPMContext.Provider value={contextValue}>{children}</UseAPMContext.Provider>;
};

function useAPM(): ApmBase {
  return useContext(UseAPMContext) as ApmBase;
}

export { APMProvider, useAPM };
