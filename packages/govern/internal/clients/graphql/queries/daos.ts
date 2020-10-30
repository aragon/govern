
const daos: string = `
   query DAOS {
      daos {
          id
          address
          metadata
          registryEntries {
              id
              name
              queue {
                  id
                  address
                  config {
                      executionDelay
                      scheduleDeposit {
                          id
                          token
                          amount
                      }
                      challengeDeposit {
                          id
                          token
                          amount
                      }
                      resolver 
                      rules
                  }
                  queued {
                      id
                      state
                      payload {
                          id
                          nonce
                          executionTime
                          submitter
                          actions {
                              id
                              to
                              value
                              data
                          }
                          allowFailuresMap
                          proof
                      }
                      history {
                          id
                      }
                  }
              }
              executor {
                  id
                  address
              }
          }
      }
   }
`

export default daos
