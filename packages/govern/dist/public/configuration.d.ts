export interface ConfigurationObject {
    governURL: string;
}
/**
 * Does set the global configuration for Govern
 *
 * @param {any} config
 *
 * @returns {void}
 */
declare function configuration(config: ConfigurationObject): void;
declare namespace configuration {
    var global: any;
}
export default configuration;
