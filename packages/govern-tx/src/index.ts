import fastify from 'fastify'

import ExecuteTransaction from './transactions/ExecuteTransaction'
import ChallengeTransaction from './transactions/ChallengeTransaction'
import ScheduleTransaction from './transactions/ScheduleTransaction'

const server = fastify()
const config = new Configuration()

// TODO: define request schema (eg. request validation, auth pre handler etc.)

// Calls GovernQueue.execute 
server.post('/execute', {}, async (request, reply) => {
    return await new ExecuteTransaction(config, request.params).execute()
})

// Calls GovernQueue.schedule
server.post('/schedule', {}, async () => {
    return await new ScheduleTransaction(config, request.params).execute()
})

// Calls GovernQueue.challenge
server.post('/challenge', {}, async () => {
    return await new ChallengeTransaction(config, request.params).execute()
})


server.listen(4040, (error, address) => {
    if (error) {
        console.error(error)
        process.exit(0)
    }

    console.log(`Server is listening at ${address}`)
})
