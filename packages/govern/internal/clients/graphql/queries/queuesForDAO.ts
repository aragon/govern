import optimisticQueue  from '../fragments/optimisticQueue'

const queuesForDao: string = `
    query QueuesForDao($address: String) {
      dao(address: $address) {
        queues() {
          ...OptimisticQueue_optimisticQueue
        }
      }
    }
    ${optimisticQueue}
  `

export default queuesForDao
