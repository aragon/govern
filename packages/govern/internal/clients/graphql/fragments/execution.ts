import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import action from './action'

const execution: DocumentNode = gql`
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

export default execution
