// TODO: define request schema (eg. request validation, auth pre handler etc.)

import fastify from 'fastify'
import authPlugin from './auth/auth-plugin'

import Configuration from './config/Configuration'
import Database from './db/Database'
import Whitelist from './db/Whitelist'
import Authenticator from './auth/Authenticator'

import ExecuteTransaction from './transactions/ExecuteTransaction'
import ChallengeTransaction from './transactions/ChallengeTransaction'
import ScheduleTransaction from './transactions/ScheduleTransaction'

import AddItemAction from './whitelist/AddItemAction'
import DeleteItemAction from './whitelist/DeleteItemAction'
import GetListAction from './whitelist/GetListAction'

const config = new Configuration()
const whitelist = new Whitelist(new Database(config));

const server = fastify({
    logger: {
        level: 'debug' // Make this configurable with a process ENV
    }
})

// Register AuthPlugin
server.register(
    authPlugin,
    {
        authenticator: new Authenticator(// TODO: Pass JWT options
            whitelist,
            'secret'
        ),
        cookieName: 'govern_token'
    }
)

server.after(() => {
    // Register Auth pre handler hook
    server.addHook('preHandler', server.authPlugin)

    /* -------------------- *
    *     Transactions     *
    * -------------------- */
    server.post('/execute', {}, (request, reply): Promise<TransactionReceipt> => {
        return new ExecuteTransaction(config, request.params).execute()
    })

    server.post('/schedule', {}, (request, reply): Promise<TransactionReceipt> => {
        return new ScheduleTransaction(config, request.params).execute()
    })

    server.post('/challenge', {}, (request, reply): Promise<TransactionReceipt> => {
        return new ChallengeTransaction(config, request.params).execute()
    })


    /* -------------------- *
    *      Whitelist       *
    * -------------------- */
    server.post('/whitelist', {}, (request, reply): Promise<boolean> => {
        return new AddItemAction(whitelist, request.params).execute()
    })

    server.delete('/whitelist', {}, (request, reply): Promise<boolean> => {
        return new DeleteItemAction(whitelist, request.params).execute()
    })

    server.get('/whitelist', {}, (request, reply): Promise<ListItem[]> => {
        return new GetListAction(whitelist).execute()
    })
})

server.listen(4040, (error, address) => {
    if (error) {
        console.error(error)
        process.exit(0)
    }

    console.log(`Server is listening at ${address}`)
})
