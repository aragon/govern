import gql from 'graphql-tag'
import action from './action'

export default gql`
    fragment Execution_execution on Execution {
      id
      sender
      actions {
        ...Action_action
      }
      results
    }
    ${action}
  `
