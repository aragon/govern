import { config as prodConfig } from '../config/prod.config'
import { config as devConfig } from '../config/dev.config'
import Configuration, { Config } from './config/Configuration'
import Bootstrap from './Bootstrap'

let config: Config;

if (process.env.DEV) {
    config = devConfig
} else {
    config = prodConfig
}

new Bootstrap(new Configuration(config)).run()
