import Configuration from '../internal/configuration/Configuration'

export interface ConfigurationObject {
  governURL?: string
}

let defaultConfig: Configuration | null = null

const governURL = 'https://govern.backend.aragon.org';

/**
 * Does set the global configuration for Govern
 *
 * @param {any} config
 *
 * @returns {void}
 */
export default function configure(config: ConfigurationObject): void {
  if (!config.governURL) {
    config.governURL = governURL;
  }

  defaultConfig = new Configuration(config)
}

export function getConfiguration() {
  if (defaultConfig !== null) {
    return defaultConfig
  }

  defaultConfig = new Configuration({ governURL: governURL })

  return defaultConfig
}
