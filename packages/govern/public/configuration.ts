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
export default function configuration(config: any): void {
  globalConfig = new Configuration(config);
}


// TODO: declare type
//@ts-ignore
configuration.global = globalConfig;
