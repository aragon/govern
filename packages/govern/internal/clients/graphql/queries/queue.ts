import optimisticQueue from '../fragments/optimisticQueue'

const queue: string = `
    query Queue($id: ID) {
      OptimisticQueue(id: $id) {
        ...OptimisticQueue_optimisticQueue
      }
    }
    ${optimisticQueue}
  `

export default queue
