import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import item from './item'
import execution from './execution'

const action: DocumentNode = gql`
    fragment Action_action on Action {
      id
      to
      value
      data
      item {
        ...Item_item
      }
      execution {
        ...Execution_execution
      }
    }
    ${execution}
    ${item}
  `

export default action
