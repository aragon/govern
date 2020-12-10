import { config as prodConfig } from '../config/prod.config'
import { config as devConfig } from '../config/dev.config'
import Configuration from './config/Configuration'
import Bootstrap from './Bootstrap'

new Bootstrap(
    new Configuration(
        process.env.DEV ? devConfig : prodConfig
    )
).run()
