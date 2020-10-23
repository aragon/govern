import gql from 'graphql-tag'
import item from './item'
import execution from './execution'

export default gql`
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

