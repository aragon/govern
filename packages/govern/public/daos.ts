import DAOSAction from '../internal/actions/DAOSAction'
import Configuration from '../internal/configuration/Configuration'

/**
 * TODO: Define return type in promise
 *
 * @returns {Promise<any>}
 */
export default function daos(): Promise<any> {
  return new DAOSAction(Configuration.get()).execute()
}
