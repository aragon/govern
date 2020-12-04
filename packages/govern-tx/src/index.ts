import Configuration from './config/Configuration'
import Bootstrap from './Bootstrap'

new Bootstrap(
    new Configuration(
        {
            ethereum: {
                publicKey: '0x0...',
                contracts: {
                    GovernQueue: '0x0...'
                },
                url: 'localhost:8545',
                blockConfirmations: 42
            }, 
            database: {
                user: 'govern',
                host: 'localhost',
                password: 'dev',
                database: 'govern',
                port: 4000
            },
            server: {
                host: '0.0.0.0',
                port: 4040
            }
        }   
    )
).run()
