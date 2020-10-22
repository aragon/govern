import Configuration from '../internal/configuration/Configuration'

export interface ConfigurationObject {
  governURL: string
}

/**
 * Does set the global configuration for Govern
 *
 * @param {any} config
 *
 * @returns {void}
 */
export default function configuration(config: ConfigurationObject): void {
  configuration.global = new Configuration(config);
}

// TODO: define type
//@ts-ignore
configuration.global = null;
