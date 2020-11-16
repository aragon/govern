// TODO: define request schema (eg. request validation, auth pre handler etc.)

import fastify from 'fastify'

import Configuration from './config/Configuration'

import ExecuteTransaction from './transactions/ExecuteTransaction'
import ChallengeTransaction from './transactions/ChallengeTransaction'
import ScheduleTransaction from './transactions/ScheduleTransaction'

import AddItemAction from './whitelist/AddItemAction'
import DeleteItemAction from './whitelist/DeleteItemAction'
import GetListAction from './whitelist/GetListAction'

const server = fastify()
const config = new Configuration()


/* -------------------- *
 *     Transactions     *
 * -------------------- */

// Calls GovernQueue.execute 
server.post('/execute', {}, async (request, reply): Promise<TransactionReceipt> => {
    return await new ExecuteTransaction(config, request.params).execute()
})

// Calls GovernQueue.schedule
server.post('/schedule', {}, async (request, reply): Promise<TransactionReceipt> => {
    return await new ScheduleTransaction(config, request.params).execute()
})

// Calls GovernQueue.challenge
server.post('/challenge', {}, async (request, reply): Promise<TransactionReceipt> => {
    return await new ChallengeTransaction(config, request.params).execute()
})


/* -------------------- *
 *      Whitelist       *
 * -------------------- */

server.post('/whitelist', {}, async (request, reply): Promise<boolean> => {
    return await new AddItemAction(config, request.params).execute()
})

server.delete('/whitelist', {}, async (request, reply): Promise<boolean> => {
    return await new DeleteItemAction(config, request.params).execute()
})

server.get('/whitelist', {}, async (request, reply): Promise<ListItem[]> => {
    return await new GetListAction(config, request.params).execute()
})


server.listen(4040, (error, address) => {
    if (error) {
        console.error(error)
        process.exit(0)
    }

    console.log(`Server is listening at ${address}`)
})
