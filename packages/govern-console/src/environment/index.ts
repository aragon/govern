import { getNetworkConfig } from './networks';
import { EnvironmentName } from './types';

const DEFAULT_ENVIRONMENT = 'rinkeby';

function getNetworkEnvironment(environment: EnvironmentName) {
  return getNetworkConfig(environment);
}

export function getEnvironmentName(): EnvironmentName {
  return (process.env.REACT_APP_ENVIRONMENT || DEFAULT_ENVIRONMENT) as EnvironmentName;
}

export const networkEnvironment = getNetworkEnvironment(getEnvironmentName());
