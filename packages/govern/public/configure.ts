import Configuration, { ConfigurationObject } from 'internal/configuration/Configuration'

export {ConfigurationObject} from 'internal/configuration/Configuration';

/**
 * Does set the global configuration for Govern
 *
 * @param {ConfigurationObject} config
 *
 * @returns {void}
 */
export default function configure(config: ConfigurationObject): void {
  Configuration.set(config);
}
