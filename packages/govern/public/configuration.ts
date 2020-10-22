import Configuration from '../internal/configuration/Configuration'

let globalConfig = null;

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
  // Added ignore with knowing of existing expectation of this call in the test
  /* istanbul ignore next */
  globalConfig = new Configuration(config);
}


// TODO: declare type
//@ts-ignore
configuration.global = globalConfig;
