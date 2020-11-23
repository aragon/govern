import Configuration from './config/Configuration'
import Bootstrap from './Bootstrap'

new Bootstrap(
    new Configuration(
        {
            url: 'localhost:8545',
            blockConfirmations: 42
        }, 
        {
            user: 'govern',
            host: 'localhost',
            password: 'dev',
            database: 'govern',
            port: 4000
        },
        {
            secret: 'secret',
            cookieName: 'govern_cookie'
        },
        {
            host: '0.0.0.0',
            port: 4040
        }
    )
).run()
